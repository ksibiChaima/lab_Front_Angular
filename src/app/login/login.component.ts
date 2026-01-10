import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { MemberService } from 'src/services/member.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  hidePassword = true;

  constructor(private AS: AuthService, private router: Router, private ms: MemberService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('rememberedEmail') || '';
    this.form = this.fb.group({
      email: [saved, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [!!saved],
      type: ['visitor']
    });
  }

  sub() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { email, password, remember } = this.form.value;
    this.loading = true;
    this.error = '';
    this.AS.signInWithEmailAndPassword(email, password).then(() => {
      this.loading = false;
      if (remember) localStorage.setItem('rememberedEmail', email); else localStorage.removeItem('rememberedEmail');
      this.router.navigate(['/member']);
    }).catch(err => { this.loading = false; this.error = err?.message || 'Login failed'; });
  }

  register() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { email, password, type } = this.form.value;
    this.loading = true;
    this.error = '';
    this.AS.registerWithEmailAndPassword(email, password)
      .then(() => {
        const name = email.split('@')[0];
        // create a member record only for student or enseignant
        if (type === 'student' || type === 'enseignant') {
          const member = { name, email, createDate: (new Date()).toISOString(), type } as any;
          this.ms.addMember(member).subscribe(() => {
          this.loading = false;
          this.router.navigate(['/member']);
        }, (e) => {
          this.loading = false;
          this.error = 'Registered but failed to create profile';
          this.router.navigate(['/member']);
        });
        } else {
          this.loading = false;
          this.router.navigate(['/member']);
        }
      })
      .catch(err => { this.loading = false; this.error = err?.message || 'Register failed'; });
  }

  togglePassword() { this.hidePassword = !this.hidePassword; }
}

