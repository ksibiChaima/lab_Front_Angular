import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { MemberService } from 'src/services/member.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from 'src/model/Member';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  success = '';
  hidePassword = true;
  isLogin = true;

  constructor(private AS: AuthService, private router: Router, private ms: MemberService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('rememberedEmail') || '';
    this.form = this.fb.group({
      email: [saved, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      fullName: ['', Validators.required],
      remember: [!!saved],
      type: ['visitor']
    });

    // Update form validators based on mode
    this.updateFormValidators();
  }

  updateFormValidators() {
    const confirmPasswordControl = this.form.get('confirmPassword');
    const fullNameControl = this.form.get('fullName');
    
    if (this.isLogin) {
      confirmPasswordControl?.clearValidators();
      fullNameControl?.clearValidators();
    } else {
      confirmPasswordControl?.setValidators([Validators.required, this.passwordMatchValidator]);
      fullNameControl?.setValidators([Validators.required]);
    }
    
    confirmPasswordControl?.updateValueAndValidity();
    fullNameControl?.updateValueAndValidity();
  }

  passwordMatchValidator(control: any) {
    const parent = control.parent;
    if (!parent) return null;
    return parent.get('password')?.value === control.value ? null : { passwordMismatch: true };
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  sub() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      return; 
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    if (this.isLogin) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }

  private handleLogin() {
    const { email, password, remember } = this.form.value;
    
    this.AS.signInWithEmailAndPassword(email, password).then(() => {
      this.loading = false;
      if (remember) localStorage.setItem('rememberedEmail', email); 
      else localStorage.removeItem('rememberedEmail');
      this.router.navigate(['/member']);
    }).catch(err => { 
      this.loading = false; 
      this.error = err?.message || 'Login failed'; 
    });
  }

  private handleRegister() {
    const { email, password, fullName, type } = this.form.value;
    
    this.AS.registerWithEmailAndPassword(email, password)
      .then(() => {
        const name = fullName || email.split('@')[0];
        // create a member record only for student or teacher
        if (type !== 'visitor') {
          const memberData: Partial<Member> = {
            id: '', // L'ID sera généré par le backend
            name,
            email,
            type,
            grade: type === 'teacher' ? 'Professor' : 'Student',
            cin: Math.random().toString(36).substring(2, 8),
            dateInscription: new Date().toISOString()
          };
          return this.ms.addMember(memberData as Member).toPromise();
        }
        return Promise.resolve();
      })
      .then(() => {
        this.loading = false;
        this.success = 'Account created successfully! You can now sign in.';
        setTimeout(() => {
          this.isLogin = true;
          this.updateFormValidators();
        }, 2000);
      })
      .catch(err => { 
        this.loading = false; 
        this.error = err?.message || 'Registration failed'; 
      });
  }
}
