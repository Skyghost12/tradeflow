import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { getStrategies } from "../../services/strategyService";
import "./TradeForm.css";

const PAIRS = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD",
  "EURJPY", "GBPJPY", "XAUUSD", "XAGUSD", "BTCUSD",
];

const EMOTIONS = ["confident", "anxious", "fomo", "greedy", "disciplined", "revenge", "neutral"];
const SESSIONS = ["asian", "london", "new-york", "sydney"];

const TradeForm = ({ defaultValues, onSubmit, onCancel, isSubmitting }) => {
  const { data: strategies = [] } = useQuery({
    queryKey: ["strategies"],
    queryFn: getStrategies,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      pair: "EURUSD",
      direction: "long",
      result: "open",
      emotion: "neutral",
      date: new Date().toISOString().slice(0, 16),
    },
  });

  return (
    <form className="trade-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="trade-form__grid">
        <div className="input-group">
          <label className="input-group__label">Pair</label>
          <div className="input-group__field">
            <select {...register("pair", { required: true })}>
              {PAIRS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-group__label">Direction</label>
          <div className="input-group__field">
            <select {...register("direction", { required: true })}>
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>
        </div>

        <Input
          label="Entry Price"
          type="number"
          step="any"
          error={errors.entry?.message}
          {...register("entry", { required: "Required", valueAsNumber: true })}
        />
        <Input
          label="Stop Loss"
          type="number"
          step="any"
          error={errors.stopLoss?.message}
          {...register("stopLoss", { required: "Required", valueAsNumber: true })}
        />
        <Input
          label="Take Profit"
          type="number"
          step="any"
          error={errors.takeProfit?.message}
          {...register("takeProfit", { required: "Required", valueAsNumber: true })}
        />
        <Input
          label="Lot Size"
          type="number"
          step="any"
          error={errors.lotSize?.message}
          {...register("lotSize", { required: "Required", valueAsNumber: true })}
        />
        <Input
          label="Risk %"
          type="number"
          step="any"
          error={errors.riskPercent?.message}
          {...register("riskPercent", { required: "Required", valueAsNumber: true })}
        />

        <div className="input-group">
          <label className="input-group__label">Strategy</label>
          <div className="input-group__field">
            <select {...register("strategy")}>
              <option value="">None</option>
              {strategies.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-group__label">Emotion</label>
          <div className="input-group__field">
            <select {...register("emotion")}>
              {EMOTIONS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-group__label">Session</label>
          <div className="input-group__field">
            <select {...register("session")}>
              <option value="">—</option>
              {SESSIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-group__label">Result</label>
          <div className="input-group__field">
            <select {...register("result")}>
              <option value="open">Open</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="breakeven">Breakeven</option>
            </select>
          </div>
        </div>

        <Input
          label="Profit ($)"
          type="number"
          step="any"
          {...register("profit", { valueAsNumber: true })}
        />

        <Input
          label="Date & Time"
          type="datetime-local"
          error={errors.date?.message}
          {...register("date", { required: "Required" })}
        />
      </div>

      <div className="input-group">
        <label className="input-group__label">Notes</label>
        <div className="input-group__field">
          <textarea rows={3} placeholder="What did you see, and why did you take it?" {...register("notes")} />
        </div>
      </div>

      <div className="trade-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>Save trade</Button>
      </div>
    </form>
  );
};

export default TradeForm;
