import { Link2, Mail, Phone, UserCircle2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import usePageMeta from '../hooks/usePageMeta';
import useTeamSettings from '../hooks/useTeamSettings';

const hasMemberContent = (member) =>
  Boolean(member?.name || member?.role || member?.email || member?.phone || member?.bio || member?.imageUrl || member?.linkedin || member?.github);

const initials = (name) => {
  const value = String(name || '').trim();
  if (!value) return 'AX';
  const parts = value.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
};

const TeamMemberCard = ({ member, badge, featured = false }) => {
  const hasImage = Boolean(member?.imageUrl);
  const hasLinks = Boolean(member?.linkedin || member?.github || member?.email || member?.phone);

  return (
    <article
      className={`premium-panel overflow-hidden p-5 md:p-6 ${
        featured ? 'bg-[linear-gradient(160deg,rgba(239,246,255,0.75),rgba(255,255,255,0.92))]' : ''
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="section-kicker">{badge}</span>
        {member?.role ? <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{member.role}</span> : null}
      </div>

      <div className="mt-4 flex items-start gap-4">
        {hasImage ? (
          <img src={member.imageUrl} alt={`${member.name || 'Team member'} profile`} className="h-20 w-20 shrink-0 rounded-2xl border border-blue-100 object-cover" />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-lg font-semibold text-blue-700">
            {initials(member?.name)}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold text-slate-800">{member?.name || 'Profile Not Added'}</h2>
          <p className="mt-1 text-sm text-slate-600">{member?.role || 'Role not configured yet'}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{member?.bio || 'Bio and responsibilities will appear here after admin updates this profile.'}</p>

      {hasLinks ? (
        <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
          {member?.email ? (
            <a
              href={`mailto:${member.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              <Mail size={14} /> Email
            </a>
          ) : null}
          {member?.phone ? (
            <a
              // Browser/devtools may show "Launched external handler for 'tel:...'" when dialing; this is expected and not an app error.
              href={`tel:${member.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              <Phone size={14} /> Phone
            </a>
          ) : null}
          {member?.linkedin ? (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              <Link2 size={14} /> LinkedIn
            </a>
          ) : null}
          {member?.github ? (
            <a
              href={member.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 text-slate-700 hover:border-blue-200 hover:text-blue-700"
            >
              <Link2 size={14} /> GitHub
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

const TeamPage = () => {
  usePageMeta({ title: 'Team', description: 'Meet ArloTechX leadership and developers.' });

  const { teamSettings } = useTeamSettings();
  const leadershipMembers = Array.isArray(teamSettings.leadership)
    ? teamSettings.leadership.filter((member) => hasMemberContent(member))
    : [];
  const developers = Array.isArray(teamSettings.developers) ? teamSettings.developers : [];
  const hasLeadership = leadershipMembers.length > 0;

  return (
    <>
      <PageHeader
        title="Leadership & Team"
        description="Meet the people building software products and digital experiences at ArloTechX."
      />

      <section className="mb-6">
        <div className={`${leadershipMembers.length > 1 ? 'grid gap-4 md:grid-cols-2' : ''}`}>
          {leadershipMembers.map((member) => (
            <TeamMemberCard key={member.id || `${member.name}-${member.role}`} member={member} badge="Leadership" featured />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold text-slate-800">Developer Team</h3>
          <span className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {developers.length} members
          </span>
        </div>

        {developers.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {developers.map((member) => (
              <TeamMemberCard key={member.id} member={member} badge="Developer" />
            ))}
          </div>
        ) : (
          <article className="premium-panel rounded-2xl border-dashed p-7 text-center">
            <UserCircle2 size={24} className="mx-auto text-blue-600" />
            <h4 className="mt-3 font-display text-xl font-semibold text-slate-800">Developer profiles are not added yet</h4>
            <p className="mt-2 text-sm text-slate-600">Add team members from Admin Team Management to show them here instantly.</p>
          </article>
        )}

        {!hasLeadership ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Leadership profile is currently empty. Configure it from Admin Team Management.
          </p>
        ) : null}
      </section>
    </>
  );
};

export default TeamPage;
