import { getStatusTone } from '../../utils/status';

const StatusBadge = ({ status }) => {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(status)}`}>{status}</span>;
};

export default StatusBadge;

