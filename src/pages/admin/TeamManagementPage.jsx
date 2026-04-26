import { useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Link2, Mail, Pencil, Phone, Plus, Save, Trash2, UserCheck, Users, X } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';
import useTeamSettings from '../../hooks/useTeamSettings';

const emptyMember = {
  name: '',
  role: '',
  email: '',
  phone: '',
  bio: '',
  imageUrl: '',
  linkedin: '',
  github: '',
};

const createId = (prefix = 'member') => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}`;
};

const TeamManagementPage = () => {
  usePageMeta({ title: 'Team Management', description: 'Manage leadership and developer profiles for public Team page.' });

  const { teamSettings, saveTeamSettings } = useTeamSettings();
  const [mode, setMode] = useState(null);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyMember);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const leadership = useMemo(() => (Array.isArray(teamSettings.leadership) ? teamSettings.leadership : []), [teamSettings.leadership]);
  const developers = useMemo(() => (Array.isArray(teamSettings.developers) ? teamSettings.developers : []), [teamSettings.developers]);

  const closeForm = () => {
    setMode(null);
    setEditingId('');
    setForm(emptyMember);
    setError('');
  };

  const openAddLeadership = () => {
    setMode('leadership-add');
    setEditingId('');
    setForm(emptyMember);
    setError('');
    setNotice('');
  };

  const openEditLeadership = (member) => {
    setMode('leadership-edit');
    setEditingId(member.id);
    setForm({ ...emptyMember, ...member });
    setError('');
    setNotice('');
  };

  const openAddDeveloper = () => {
    setMode('developer-add');
    setEditingId('');
    setForm(emptyMember);
    setError('');
    setNotice('');
  };

  const openEditDeveloper = (member) => {
    setMode('developer-edit');
    setEditingId(member.id);
    setForm({ ...emptyMember, ...member });
    setError('');
    setNotice('');
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.role.trim()) {
      setError('Name and role are required.');
      return;
    }

    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, String(value || '').trim()]));

    if (mode === 'leadership-add') {
      const nextLeader = { id: createId('lead'), ...payload };
      await saveTeamSettings({
        ...teamSettings,
        leadership: [nextLeader, ...leadership],
      });
      setNotice('Leadership member added successfully.');
      closeForm();
      return;
    }

    if (mode === 'leadership-edit') {
      const nextLeadership = leadership.map((member) => (member.id === editingId ? { ...member, ...payload } : member));
      await saveTeamSettings({
        ...teamSettings,
        leadership: nextLeadership,
      });
      setNotice('Leadership member updated successfully.');
      closeForm();
      return;
    }

    if (mode === 'developer-add') {
      const nextDeveloper = { id: createId('dev'), ...payload };
      await saveTeamSettings({
        ...teamSettings,
        developers: [nextDeveloper, ...developers],
      });
      setNotice('Developer added successfully.');
      closeForm();
      return;
    }

    if (mode === 'developer-edit') {
      const nextDevelopers = developers.map((member) => (member.id === editingId ? { ...member, ...payload } : member));
      await saveTeamSettings({
        ...teamSettings,
        developers: nextDevelopers,
      });
      setNotice('Developer details updated successfully.');
      closeForm();
    }
  };

  const deleteLeadership = async (id) => {
    const selected = leadership.find((member) => member.id === id);
    const confirmDelete = window.confirm(`Delete ${selected?.name || 'this leadership member'} from leadership list?`);
    if (!confirmDelete) return;

    await saveTeamSettings({
      ...teamSettings,
      leadership: leadership.filter((member) => member.id !== id),
    });

    if (mode === 'leadership-edit' && editingId === id) {
      closeForm();
    }
    setNotice('Leadership member removed successfully.');
  };

  const deleteDeveloper = async (id) => {
    const selected = developers.find((member) => member.id === id);
    const confirmDelete = window.confirm(`Delete ${selected?.name || 'this developer'} from team list?`);
    if (!confirmDelete) return;

    await saveTeamSettings({
      ...teamSettings,
      developers: developers.filter((member) => member.id !== id),
    });

    if (mode === 'developer-edit' && editingId === id) {
      closeForm();
    }
    setNotice('Developer removed successfully.');
  };

  const fields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'role', label: 'Role', required: true },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'imageUrl', label: 'Image URL' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
  ];

  const formTitle = mode === 'leadership-add'
    ? 'Add Leadership Member'
    : mode === 'leadership-edit'
      ? 'Edit Leadership Member'
      : mode === 'developer-edit'
        ? 'Edit Developer'
        : 'Add Developer';

  return (
    <>
      <PageHeader
        title="Team Management"
        description="Manage leadership and developer team data for the public Team page."
        actions={
          <>
            <button type="button" onClick={openAddLeadership} className="btn-secondary">
              <UserCheck size={15} /> Add Leadership Member
            </button>
            <button type="button" onClick={openAddDeveloper} className="btn-primary">
              <Plus size={15} /> Add Developer
            </button>
          </>
        }
      />

      {notice ? <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{notice}</p> : null}

      <AnimatePresence mode="wait">
        {mode ? (
          <Motion.form
            key="team-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={submitForm}
            className="premium-panel mb-6 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-blue-100 pb-3">
              <div>
                <p className="section-kicker">Team Form</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-800">{formTitle}</h2>
              </div>
              <button type="button" onClick={closeForm} className="rounded-lg border border-blue-100 bg-white p-2 text-slate-500 hover:text-blue-700">
                <X size={14} />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className="text-sm text-slate-600">
                  {field.label}
                  {field.required ? ' *' : ''}
                  <input
                    value={form[field.key]}
                    onChange={(event) => updateForm(field.key, event.target.value)}
                    className="input-shell mt-1.5"
                    required={Boolean(field.required)}
                  />
                </label>
              ))}
              <label className="text-sm text-slate-600 sm:col-span-2">
                Bio
                <textarea value={form.bio} onChange={(event) => updateForm('bio', event.target.value)} className="input-shell mt-1.5 min-h-[120px]" />
              </label>
            </div>

            {error ? <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button type="submit" className="btn-primary">
                <Save size={15} /> Save
              </button>
              <button type="button" onClick={closeForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </Motion.form>
        ) : null}
      </AnimatePresence>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-slate-800">Leadership Section</h2>
          <span className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {leadership.length} members
          </span>
        </div>

        {leadership.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {leadership.map((member) => (
              <article key={member.id} className="premium-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{member.name || 'Unnamed Leadership Member'}</h3>
                    <p className="text-sm text-slate-600">{member.role || '-'}</p>
                  </div>
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Leadership</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{member.bio || 'No bio added.'}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  {member.email ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-white px-3 py-1.5">
                      <Mail size={12} /> {member.email}
                    </span>
                  ) : null}
                  {member.phone ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-white px-3 py-1.5">
                      <Phone size={12} /> {member.phone}
                    </span>
                  ) : null}
                  {member.linkedin ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-white px-3 py-1.5">
                      <Link2 size={12} /> LinkedIn
                    </span>
                  ) : null}
                  {member.github ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-white px-3 py-1.5">
                      <Link2 size={12} /> GitHub
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => openEditLeadership(member)} className="btn-secondary px-3 py-2 text-xs">
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteLeadership(member.id)}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="premium-panel rounded-2xl border-dashed p-6 text-center">
            <UserCheck size={22} className="mx-auto text-blue-600" />
            <h3 className="mt-3 font-display text-xl font-semibold text-slate-800">No leadership members added</h3>
            <p className="mt-2 text-sm text-slate-600">Use Add Leadership Member to create public leadership profiles.</p>
          </article>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-slate-800">Developer List</h2>
          <span className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {developers.length} members
          </span>
        </div>

        {developers.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {developers.map((member) => (
              <article key={member.id} className="premium-panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{member.name || 'Unnamed Developer'}</h3>
                    <p className="text-sm text-slate-600">{member.role || '-'}</p>
                  </div>
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">Developer</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{member.bio || 'No bio added.'}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  {member.email ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-white px-3 py-1.5">
                      <Mail size={12} /> {member.email}
                    </span>
                  ) : null}
                  {member.phone ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-white px-3 py-1.5">
                      <Phone size={12} /> {member.phone}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => openEditDeveloper(member)} className="btn-secondary px-3 py-2 text-xs">
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDeveloper(member.id)}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="premium-panel rounded-2xl border-dashed p-6 text-center">
            <Users size={22} className="mx-auto text-blue-600" />
            <h3 className="mt-3 font-display text-xl font-semibold text-slate-800">No developers added</h3>
            <p className="mt-2 text-sm text-slate-600">Use Add Developer to create the developer list for the public Team page.</p>
          </article>
        )}
      </section>
    </>
  );
};

export default TeamManagementPage;
