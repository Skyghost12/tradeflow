import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import Input from "../components/UI/Input";
import StatCard from "../components/UI/StatCard";
import EmptyState from "../components/UI/EmptyState";
import LoadingScreen from "../components/UI/LoadingScreen";
import { getLogs, createLog, getPsychologyReport } from "../services/psychologyService";
import { formatDate } from "../utils/format";
import "./Psychology.css";

const EMOTIONS = ["calm", "confident", "anxious", "excited", "fearful", "frustrated", "neutral"];

const Psychology = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: logs = [], isLoading } = useQuery({ queryKey: ["psychology-logs"], queryFn: getLogs });
  const { data: report } = useQuery({ queryKey: ["psychology-report"], queryFn: getPsychologyReport });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      emotionBefore: "calm",
      emotionAfter: "calm",
      confidence: 5,
      stressLevel: 5,
      sleepHours: 7,
      disciplineScore: 5,
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const createMutation = useMutation({
    mutationFn: createLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["psychology-logs"] });
      queryClient.invalidateQueries({ queryKey: ["psychology-report"] });
      setModalOpen(false);
      reset();
    },
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="psychology">
      {report && (
        <div className="psychology__stats">
          <StatCard label="Avg Confidence" value={report.averageConfidence} suffix="/10" tone="bull" />
          <StatCard label="Avg Stress" value={report.averageStress} suffix="/10" tone="bear" />
          <StatCard label="Avg Sleep" value={report.averageSleepHours} suffix="h" />
          <StatCard label="Avg Discipline" value={report.averageDiscipline} suffix="/10" tone="gold" />
        </div>
      )}

      {report?.sleepImpact && (
        <Card className="psychology__insight">
          <h3>Sleep &amp; Discipline</h3>
          <p>
            On nights under 6 hours of sleep, your discipline score averages{" "}
            <strong>{report.sleepImpact.disciplineOnLowSleep ?? "—"}</strong>. With 6+ hours, it averages{" "}
            <strong>{report.sleepImpact.disciplineOnGoodSleep ?? "—"}</strong>.
          </p>
        </Card>
      )}

      <div className="psychology__toolbar">
        <h3>Entries</h3>
        <Button icon={FiPlus} onClick={() => setModalOpen(true)}>Log entry</Button>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          title="No psychology entries yet"
          message="Log how you feel before and after trading to reveal emotional patterns over time."
          action={<Button icon={FiPlus} onClick={() => setModalOpen(true)}>Log entry</Button>}
        />
      ) : (
        <Card padded={false}>
          <div className="psych-table">
            <div className="psych-table__head">
              <span>Date</span>
              <span>Before</span>
              <span>After</span>
              <span>Confidence</span>
              <span>Stress</span>
              <span>Sleep</span>
              <span>Discipline</span>
            </div>
            {logs.map((log) => (
              <div className="psych-table__row" key={log._id}>
                <span className="mono">{formatDate(log.date)}</span>
                <span className="capitalize">{log.emotionBefore}</span>
                <span className="capitalize">{log.emotionAfter}</span>
                <span className="mono">{log.confidence}/10</span>
                <span className="mono">{log.stressLevel}/10</span>
                <span className="mono">{log.sleepHours}h</span>
                <span className="mono">{log.disciplineScore}/10</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log psychology entry">
        <form className="psych-form" onSubmit={handleSubmit((data) => createMutation.mutate(data))}>
          <div className="psych-form__grid">
            <div className="input-group">
              <label className="input-group__label">Emotion Before</label>
              <div className="input-group__field">
                <select {...register("emotionBefore")}>
                  {EMOTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-group__label">Emotion After</label>
              <div className="input-group__field">
                <select {...register("emotionAfter")}>
                  {EMOTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <Input label="Confidence (1-10)" type="number" min="1" max="10" {...register("confidence", { valueAsNumber: true })} />
            <Input label="Stress Level (1-10)" type="number" min="1" max="10" {...register("stressLevel", { valueAsNumber: true })} />
            <Input label="Sleep Hours" type="number" step="0.5" min="0" max="24" {...register("sleepHours", { valueAsNumber: true })} />
            <Input label="Discipline Score (1-10)" type="number" min="1" max="10" {...register("disciplineScore", { valueAsNumber: true })} />
            <Input label="Date" type="date" {...register("date")} />
          </div>
          <div className="input-group">
            <label className="input-group__label">Notes</label>
            <div className="input-group__field">
              <textarea rows={3} placeholder="What was going on today?" {...register("notes")} />
            </div>
          </div>
          <div className="trade-form__actions">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Save entry</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Psychology;
