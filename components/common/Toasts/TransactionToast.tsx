import { useSolana } from '../../../context';
import {
  getExplorerLink,
  getExplorerLink2,
} from '../../../utils/general';

type TransactionSuccessProps = {
  txSig: string;
  message: string;
};
type TransactionSuccessProps2 = {
  txSig2: void | string[];
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


export function TransactionToast2({
  txSig2,
  message,
}: TransactionSuccessProps2) {
  const { cluster } = useSolana();
  return (
    <div className="flex flex-col space-y-1">
      <p>{message}</p>
      <a
        href={getExplorerLink2(txSig2, cluster.network)}
        target="_blank"
        rel="noopener noreferrer"
        className="italic font-light text-sm"
      >
        View transaction
      </a>
    </div>
  );
}