'use client';
import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/layout/PageHeader';
import { workersService } from '@/services/workers.service';
import toast from 'react-hot-toast';

const SUGGESTED_SKILLS = ['Plumbing', 'Electrical', 'AC Repair', 'Deep Cleaning', 'Painting', 'Carpentry', 'Pest Control', 'Appliance Repair', 'Waterproofing', 'Welding', 'Tiling', 'Interior Design'];

export default function SkillsPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    workersService.getProfile()
      .then((r) => setSkills(r.data.data?.skills?.map((s: any) => s.skill) || []))
      .catch(() => {});
  }, []);

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (!s || skills.includes(s)) return;
    setSkills((prev) => [...prev, s]);
    setInput('');
  };

  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSave = async () => {
    setSaving(true);
    try {
      await workersService.updateSkills(skills);
      toast.success('Skills updated!');
    } catch {
      toast.error('Failed to update skills');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Skills & Services" showBack subtitle="Add your expertise to attract more customers" />

      <div className="max-w-2xl space-y-5">
        {/* Add skill input */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Add a Skill</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill(input)}
              placeholder="Type a skill and press Enter…"
              className="input-field flex-1"
            />
            <button onClick={() => addSkill(input)} className="btn-primary !px-4 shrink-0">
              <Plus size={18} />
            </button>
          </div>

          {/* Suggestions */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">Suggested:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current skills */}
        {skills.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Your Skills ({skills.length})</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-blue-900 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
              {saving ? 'Saving…' : 'Save Skills'}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
