import {
  FormState,
  UseFormRegister,
} from 'react-hook-form';

import { CreatePoolFormValues } from '../../pages/pool/create';
import { validatePubkey } from '../../utils/pubkey';

type CreatePoolFormProps = {
  register: UseFormRegister<CreatePoolFormValues>;
  formState: FormState<CreatePoolFormValues>;
};
export default function CreatePoolForm({
  register,
  formState: { errors },
}: CreatePoolFormProps) {
  return (
    <div className="space-y-2">
      <div>

      <label className="block text-xs text-slate-400">Market Address</label>
        <div className="mt-1">
          <input
            type="text"
            className="block w-full rounded-md p-2 bg-slate-700 focus-style sm:text-sm"
            {...register("marketId", {
              required: true,
              validate: validatePubkey,
            })}
          />
          {errors?.marketId ? (
            <p className="text-xs text-red-400 mt-1">
              {errors?.marketId?.message}
            </p>
          ) : null}
        </div>
      </div>
      <div>

        <label className="block text-xs text-slate-400">Base Amount</label>
        <div className="mt-1">
          <input
            type="number"
            step="0.0000000001"
            className="block w-full rounded-md p-2 bg-slate-700 focus-style sm:text-sm"
            {...register("baseAmount", {
              required: true,
            //   validate: validatePubkey,
            })}
          />
          {errors?.baseAmount ? (
            <p className="text-xs text-red-400 mt-1">
              {errors?.baseAmount?.message}
            </p>
          ) : null}
        </div>
      </div>
      <div>

        <label className="block text-xs text-slate-400">Quote Amount</label>
        <div className="mt-1">
          <input
            type="number"
            step="0.0000000001"
            className="block w-full rounded-md p-2 bg-slate-700 focus-style sm:text-sm"
            {...register("qouteAmount", {
              required: true,
            //   validate: validatePubkey,
            })}
          />
          {errors?.qouteAmount ? (
            <p className="text-xs text-red-400 mt-1">
              {errors?.qouteAmount?.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
