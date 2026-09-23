import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Sparkles,
  Save,
  Plus,
  X,
  Target,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [college, setCollege] = useState('');
  const [preparationGoals, setPreparationGoals] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [preferredCompanies, setPreferredCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setTargetRole(user.targetRole || 'Software Engineer');
      setExperienceLevel(user.experienceLevel || 'Fresher');
      setCollege(user.college || '');
      setPreparationGoals(user.preparationGoals || '');
      setSkills(Array.isArray(user.skills) ? user.skills : ['JavaScript', 'React', 'DSA']);
      setPreferredCompanies(Array.isArray(user.preferredCompanies) ? user.preferredCompanies : ['Google', 'Amazon']);
    }
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (!newCompany.trim()) return;
    if (!preferredCompanies.includes(newCompany.trim())) {
      setPreferredCompanies([...preferredCompanies, newCompany.trim()]);
    }
    setNewCompany('');
  };

  const handleRemoveCompany = (compToRemove) => {
    setPreferredCompanies(preferredCompanies.filter((c) => c !== compToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUserProfile({
        name,
        targetRole,
        experienceLevel,
        college,
        skills,
        preferredCompanies,
        preparationGoals,
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast(err.message || 'Profile update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/90 backdrop-blur-xl shadow-2xl flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0 uppercase">
          {name.charAt(0) || 'C'}
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{name || 'Candidate Profile'}</h2>
          <p className="text-xs sm:text-sm text-cyan-400 font-semibold">{targetRole} • {experienceLevel}</p>
          <p className="text-xs text-slate-300 mt-1">Profile data personalizes AI interview sessions and learning metrics.</p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-6 bg-[#141b30]/90 border-white/10">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Candidate Details</h3>
            <span className="text-xs text-slate-400">Fields marked * are required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Email Address (Read-Only)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  readOnly
                  value={email}
                  className="w-full bg-[#0d1322] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#10172a] border border-white/15 hover:border-white/25 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="Software Engineer" className="bg-[#141b30] text-white">Software Engineer (General SDE)</option>
                <option value="Frontend Developer" className="bg-[#141b30] text-white">Frontend Developer (React / Web)</option>
                <option value="Backend Engineer" className="bg-[#141b30] text-white">Backend Engineer (Node / Java / APIs)</option>
                <option value="Full Stack Developer" className="bg-[#141b30] text-white">Full Stack Developer</option>
                <option value="Data Engineer" className="bg-[#141b30] text-white">Data Engineer / Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-[#10172a] border border-white/15 hover:border-white/25 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="Student" className="bg-[#141b30] text-white">Final-year College Student</option>
                <option value="Fresher" className="bg-[#141b30] text-white">Fresh Graduate (0-1 yr)</option>
                <option value="Entry level" className="bg-[#141b30] text-white">Entry level Engineer</option>
                <option value="1-2 years" className="bg-[#141b30] text-white">1-2 years Experienced</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="College / University / Education Summary"
                icon={GraduationCap}
                placeholder="e.g. B.Tech Computer Science, Class of 2026"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Placement & Career Goals
              </label>
              <textarea
                value={preparationGoals}
                onChange={(e) => setPreparationGoals(e.target.value)}
                rows={3}
                placeholder="Describe your target company goals, CTC expectations, or focus areas..."
                className="w-full bg-[#10172a] border border-white/15 rounded-xl p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>
        </Card>

        {/* Skills & Companies Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Skills Tag Input */}
          <Card className="p-6 space-y-4 bg-[#141b30]/90 border-white/10">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Core Technical Skills</span>
            </h4>

            <div className="flex flex-wrap gap-2 min-h-[48px] p-2.5 rounded-xl bg-[#10172a] border border-white/10">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-white ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. TypeScript)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 bg-[#10172a] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
              <Button size="sm" variant="secondary" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
          </Card>

          {/* Preferred Companies Tag Input */}
          <Card className="p-6 space-y-4 bg-[#141b30]/90 border-white/10">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preferred Target Companies</span>
            </h4>

            <div className="flex flex-wrap gap-2 min-h-[48px] p-2.5 rounded-xl bg-[#10172a] border border-white/10">
              {preferredCompanies.map((comp) => (
                <span
                  key={comp}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-medium"
                >
                  <span>{comp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompany(comp)}
                    className="hover:text-white ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add target company (e.g. Google)..."
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="flex-1 bg-[#10172a] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
              <Button size="sm" variant="secondary" onClick={handleAddCompany}>
                Add
              </Button>
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            isLoading={saving}
          >
            Save Profile Updates
          </Button>
        </div>
      </form>
    </div>
  );
};
