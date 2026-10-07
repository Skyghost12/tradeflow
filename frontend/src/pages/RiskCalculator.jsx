import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiPercent } from "react-icons/fi";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { calculateRisk } from "../services/riskService";
import { formatCurrency } from "../utils/format";
import "./RiskCalculator.css";

const PAIRS = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "XAUUSD"];

const RiskCalculator = () => {
  const [form, setForm] = useState({ balance: "", riskPercent: "", stopLossPips: "", pair: "EURUSD" });

  const mutation = useMutation({
    mutationFn: calculateRisk,
  });

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      balance: Number(form.balance),
      riskPercent: Number(form.riskPercent),
      stopLossPips: Number(form.stopLossPips),
      pair: form.pair,
    });
  };

  const result = mutation.data;

  return (
    <div className="risk-calculator">
      <div className="risk-calculator__grid">
        <Card>
          <div className="risk-calculator__head">
            <FiPercent />
            <h3>Position Size Calculator</h3>
          </div>
          <p className="risk-calculator__intro">
            Know your position size before you're in the trade — not after you've already broken your risk rule.
          </p>

          <form onSubmit={handleSubmit} className="risk-calculator__form">
            <Input
              label="Account Balance ($)"
              type="number"
              step="any"
              placeholder="10000"
              value={form.balance}
              onChange={handleChange("balance")}
              required
            />
            <Input
              label="Risk %"
              type="number"
              step="any"
              placeholder="1"
              value={form.riskPercent}
              onChange={handleChange("riskPercent")}
              required
            />
            <Input
              label="Stop Loss (pips)"
              type="number"
              step="any"
              placeholder="20"
              value={form.stopLossPips}
              onChange={handleChange("stopLossPips")}
              required
            />
            <div className="input-group">
              <label className="input-group__label">Pair</label>
              <div className="input-group__field">
                <select value={form.pair} onChange={handleChange("pair")}>
                  {PAIRS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button type="submit" fullWidth loading={mutation.isPending}>Calculate</Button>
          </form>
        </Card>

        <Card className="risk-calculator__result">
          <h3>Result</h3>
          {!result ? (
            <p className="risk-calculator__placeholder">
              Fill in the form and calculate to see your suggested position size.
            </p>
          ) : (
            <div className="risk-result">
              <div className="risk-result__item risk-result__item--primary">
                <span>Suggested Lot Size</span>
                <strong>{result.suggestedLotSize}</strong>
              </div>
              <div className="risk-result__item">
                <span>Money Risked</span>
                <strong>{formatCurrency(result.moneyRisked)}</strong>
              </div>
              <div className="risk-result__item">
                <span>Position Size (units)</span>
                <strong>{result.positionSizeUnits.toLocaleString()}</strong>
              </div>
              <div className="risk-result__item">
                <span>Pip Value / Standard Lot</span>
                <strong>{formatCurrency(result.pipValuePerStandardLot)}</strong>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RiskCalculator;
