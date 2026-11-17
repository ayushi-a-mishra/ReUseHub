import { useState } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { useAuth } from '../context/AuthContext'
import { useToast } from '@/shared/ui/toast'
import { campusConfig } from '@/config/campus'
import { UserRole } from '@/types'
import { Sparkles, Shield, User, GraduationCap, CheckCircle2, Mail } from 'lucide-react'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const { login, signup, loginAsStudent, loginAsFaculty, loginAsAdmin, isDomainValid } = useAuth()
  const { toast } = useToast()

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Signup form state
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupRole, setSignupRole] = useState<UserRole>('student')
  const [signupDepartment, setSignupDepartment] = useState(campusConfig.departments[0].id)
  const [signupRoll, setSignupRoll] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupVerificationSent, setSignupVerificationSent] = useState(false)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast({ title: 'Missing fields', description: 'Please fill in both email and password', type: 'error' })
      return
    }

    setLoginLoading(true)
    const res = await login(loginEmail, loginPassword)
    setLoginLoading(false)

    if (res.success) {
      toast({ title: 'Welcome back!', description: `Signed in successfully to ${campusConfig.shortName}`, type: 'success' })
      onOpenChange(false)
    } else {
      toast({ title: 'Sign in failed', description: res.error || 'Invalid credentials', type: 'error' })
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupName || !signupEmail || !signupPassword) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields', type: 'error' })
      return
    }

    if (!isDomainValid(signupEmail)) {
      toast({
        title: 'Unauthorized email domain',
        description: `Registration is restricted to verified campus addresses (@${campusConfig.emailDomain})`,
        type: 'error',
      })
      return
    }

    setSignupLoading(true)
    const res = await signup({
      email: signupEmail,
      password: signupPassword,
      full_name: signupName,
      role: signupRole,
      department_id: signupDepartment,
      roll_number: signupRoll,
    })
    setSignupLoading(false)

    if (res.success) {
      setSignupVerificationSent(true)
      toast({
        title: 'Verification Link Dispatched',
        description: `A simulated activation link has been verified for ${signupEmail}. Welcome to ReUseHub!`,
        type: 'success',
      })
      setTimeout(() => {
        setSignupVerificationSent(false)
        onOpenChange(false)
      }, 1800)
    } else {
      toast({ title: 'Sign up failed', description: res.error || 'Could not create account', type: 'error' })
    }
  }

  const handleDemoStudent = () => {
    loginAsStudent()
    toast({
      title: 'Logged in as Priya Sharma',
      description: 'Student (Giver/Taker) • IT Department',
      type: 'success',
    })
    onOpenChange(false)
  }

  const handleDemoFaculty = () => {
    loginAsFaculty()
    toast({
      title: 'Logged in as Prof. Arvind Kulkarni',
      description: 'Faculty Lab Incharge • Computer Engineering',
      type: 'success',
    })
    onOpenChange(false)
  }

  const handleDemoAdmin = () => {
    loginAsAdmin()
    toast({
      title: 'Logged in as Rajesh Verma',
      description: 'Sustainability Admin • Eco-Cell',
      type: 'success',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="h-4 w-4" />
          <span>{campusConfig.shortName} Campus Verified Platform</span>
        </div>
        <DialogTitle>Welcome to {campusConfig.logoText}</DialogTitle>
        <DialogDescription>
          {campusConfig.tagline} Peer-to-peer, zero money, high circular impact.
        </DialogDescription>
      </DialogHeader>

      {/* Demo Quick Logins Section with exact button labels */}
      <div className="mb-6 rounded-card border border-green-200 dark:border-green-900/60 bg-green-50/60 dark:bg-green-950/20 p-4">
        <div className="text-xs font-semibold text-green-900 dark:text-green-300 uppercase tracking-wide flex items-center justify-between mb-3">
          <span>⚡ Fast Demo Access</span>
          <span className="text-[11px] font-normal text-text-muted">Instant role switch</span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <button
            type="button"
            onClick={handleDemoStudent}
            className="flex flex-col items-start gap-1 rounded-button border border-border/70 bg-card p-3 text-left transition-all duration-120 hover:border-primary hover:shadow-elevation-1 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 w-full">
              <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-primary">Student</span>
            </div>
            <p className="text-xs font-medium text-foreground mt-1">Continue as Student</p>
            <p className="text-[10px] text-text-muted">Priya Sharma &bull; IT</p>
          </button>

          <button
            type="button"
            onClick={handleDemoFaculty}
            className="flex flex-col items-start gap-1 rounded-button border border-border/70 bg-card p-3 text-left transition-all duration-120 hover:border-primary hover:shadow-elevation-1 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 w-full">
              <div className="rounded-full bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Faculty</span>
            </div>
            <p className="text-xs font-medium text-foreground mt-1">Continue as Faculty</p>
            <p className="text-[10px] text-text-muted">Prof. Arvind Kulkarni</p>
          </button>

          <button
            type="button"
            onClick={handleDemoAdmin}
            className="flex flex-col items-start gap-1 rounded-button border border-border/70 bg-card p-3 text-left transition-all duration-120 hover:border-primary hover:shadow-elevation-1 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 w-full">
              <div className="rounded-full bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Admin</span>
            </div>
            <p className="text-xs font-medium text-foreground mt-1">Continue as Admin</p>
            <p className="text-[10px] text-text-muted">Rajesh Verma &bull; Eco-Cell</p>
          </button>
        </div>
      </div>

      {signupVerificationSent ? (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/60 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">Email Verified Successfully</h3>
          <p className="text-xs text-text-muted max-w-sm">
            Welcome to the {campusConfig.shortName} circular economy network! Redirecting to your dashboard...
          </p>
        </div>
      ) : (
        <Tabs value={tab} onValueChange={(val) => setTab(val as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Register Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Campus Email</label>
                <Input
                  type="email"
                  placeholder={`name@${campusConfig.emailDomain}`}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={loginLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Password</label>
                  <button
                    type="button"
                    onClick={() => toast({ title: 'Password Reset', description: 'A reset token has been dispatched to your campus email address.', type: 'info' })}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loginLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" isLoading={loginLoading}>
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Rohan Mehta"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  disabled={signupLoading}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Campus Email Address <span className="text-primary font-bold">(@{campusConfig.emailDomain})</span>
                </label>
                <Input
                  type="email"
                  placeholder={`roll_no@${campusConfig.emailDomain}`}
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  disabled={signupLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Campus Role</label>
                  <Select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
                    disabled={signupLoading}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty / Lab Staff</option>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Roll / Employee ID</label>
                  <Input
                    type="text"
                    placeholder="e.g. IT22B015"
                    value={signupRoll}
                    onChange={(e) => setSignupRoll(e.target.value)}
                    disabled={signupLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Department</label>
                <Select
                  value={signupDepartment}
                  onChange={(e) => setSignupDepartment(e.target.value)}
                  disabled={signupLoading}
                >
                  {campusConfig.departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Create Password</label>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={signupLoading}
                  required
                />
              </div>

              <Button type="submit" variant="accent" className="w-full mt-2" isLoading={signupLoading}>
                <Mail className="h-4 w-4 mr-2" />
                <span>Create Campus Account</span>
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      )}
    </Dialog>
  )
}
