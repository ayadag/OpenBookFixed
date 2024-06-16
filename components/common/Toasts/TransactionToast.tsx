import { useSolana } from '../../../context';
import {
  getExplorerLink,
  getExplorerLink2,
} from '../../../utils/general';

type TransactionSuccessProps = {
  txSig: string;
  message: string;
};

export default function TransactionToast({
  txSig,
  message,
}: TransactionSuccessProps) {
  const { cluster } = useSolana();
  return (
    <div className="flex flex-col space-y-1">
      <p>{message}</p>
      <a
        href={getExplorerLink(txSig, cluster.network)}
        target="_blank"
        rel="noopener noreferrer"
        className="italic font-light text-sm"
      >
        View transaction
      </a>
    </div>
  );
}

type TransactionSuccessProps2 = {
  txSig: void | string[];
  message: string;
};

export function TransactionToast2({
  txSig,
  message,
}: TransactionSuccessProps2) {
  const { cluster } = useSolana();
  return (
    <div className="flex flex-col space-y-1">
      <p>{message}</p>
      <a
        href={getExplorerLink2(txSig, cluster.network)}
        target="_blank"
        rel="noopener noreferrer"
        className="italic font-light text-sm"
      >
        View transaction
      </a>
    </div>
  );
}