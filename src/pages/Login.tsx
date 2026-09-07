import { FormEvent, useState } from 'react';
import { BriefcaseBusiness, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import { Role } from '../types/leave';
import { Button } from '../components/ui/Button';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onDemoRole: (role: Role) => Promise<boolean>;
  error?: string | null;
}

const demoAccounts: Record<Role, { label: string; email: string; password: string; icon: JSX.Element }> = {
  employee: { label: 'Employee', email: 'employee@example.com', password: 'password123', icon: <UserRound size={16} /> },
  manager: { label: 'Manager', email: 'manager@example.com', password: 'password123', icon: <UsersRound size={16} /> },
  hr: { label: 'HR', email: 'hr@example.com', password: 'password123', icon: <ShieldCheck size={16} /> },
};

export const Login: React.FC<LoginProps> = ({ onLogin, onDemoRole, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);
    const success = await onLogin(email.trim(), password);
    setSubmitting(false);
    if (!success) setFormError('Check your email and password, then try again.');
  };

  const useDemo = async (role: Role) => {
    const account = demoAccounts[role];
    setEmail(account.email);
    setPassword(account.password);
    setFormError('');
    setSubmitting(true);
    await onDemoRole(role);
    setSubmitting(false);
  };

  const message = formError || error;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: 'var(--font-inter)' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '24px', fontWeight: 800, boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>P</div>
          <h1 style={{ margin: '14px 0 6px', fontSize: '30px', fontWeight: 800, color: 'var(--color-text)' }}>Welcome to PeopleOS</h1>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px' }}>Sign in to manage your people operations.</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '28px', boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
              Work email
              <span style={{ display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '11px 12px' }}>
                <Mail size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required autoComplete="email" style={{ border: 0, outline: 0, width: '100%', font: 'inherit', fontWeight: 500, color: 'var(--color-text)' }} />
              </span>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
              Password
              <span style={{ display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '11px 12px' }}>
                <LockKeyhole size={16} style={{ color: 'var(--color-text-secondary)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required autoComplete="current-password" style={{ border: 0, outline: 0, width: '100%', font: 'inherit', fontWeight: 500, color: 'var(--color-text)' }} />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} style={{ border: 0, background: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {message && <div role="alert" style={{ padding: '11px 12px', borderRadius: '8px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: 'var(--color-danger)', fontSize: '13px', lineHeight: 1.4 }}>{message}</div>}

            <Button type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
              <BriefcaseBusiness size={16} />
              {submitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 16px', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
            <span style={{ height: '1px', backgroundColor: 'var(--color-border)', flex: 1 }} />
            Demo access
            <span style={{ height: '1px', backgroundColor: 'var(--color-border)', flex: 1 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {(Object.keys(demoAccounts) as Role[]).map((role) => (
              <button key={role} type="button" onClick={() => void useDemo(role)} disabled={submitting} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#FFFFFF', color: 'var(--color-text-secondary)', padding: '10px 6px', cursor: 'pointer', font: 'inherit', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                {demoAccounts[role].icon}
                {demoAccounts[role].label}
              </button>
            ))}
          </div>
          <p style={{ margin: '16px 0 0', textAlign: 'center', fontSize: '11px', color: 'var(--color-text-secondary)' }}>Demo password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;