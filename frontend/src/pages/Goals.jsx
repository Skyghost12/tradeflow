import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FiPlus, FiTrash2, FiTarget, FiAward } from "react-icons/fi";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import Input from "../components/UI/Input";
import EmptyState from "../components/UI/EmptyState";
import LoadingScreen from "../components/UI/LoadingScreen";
import { getGoals, createGoal, deleteGoal } from "../services/goalService";
import { formatDate } from "../utils/format";
import "./Goals.css";

const TIMEFRAMES = ["weekly", "monthly", "yearly"];

const Goals = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals", tab],
    queryFn: () => getGoals(tab || undefined),
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      timeframe: "monthly",
      targetType: "profit",
      title: "",
      targetValue: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setModalOpen(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals"] }),
  });

  const handleDelete = (id) => {
    if (confirm("Delete this goal?")) deleteMutation.mutate(id);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="goals-page">
      <div className="goals-page__toolbar">
        <div className="goals-page__tabs">
          <button className={!tab ? "goals-tab goals-tab--active" : "goals-tab"} onClick={() => setTab("")}>All</button>
          {TIMEFRAMES.map((t) => (
            <button
              key={t}
              className={tab === t ? "goals-tab goals-tab--active" : "goals-tab"}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <Button icon={FiPlus} onClick={() => setModalOpen(true)}>New goal</Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          title="No goals set"
          message="Set a weekly, monthly, or yearly target and track it against your real trade data."
          action={<Button icon={FiPlus} onClick={() => setModalOpen(true)}>New goal</Button>}
        />
      ) : (
        <div className="goals-page__grid">
          {goals.map((goal) => (
            <Card key={goal._id} className="goal-card">
              <div className="goal-card__head">
                <div>
                  <span className="goal-card__timeframe">{goal.timeframe}</span>
                  <h4>{goal.title}</h4>
                </div>
                <button onClick={() => handleDelete(goal._id)} aria-label="Delete"><FiTrash2 /></button>
              </div>

              <div className="goal-card__progress">
                <div className="goal-card__bar-track">
                  <div
                    className={`goal-card__bar-fill ${goal.achieved ? "goal-card__bar-fill--achieved" : ""}`}
                    style={{ width: `${goal.progressPercent}%` }}
                  />
                </div>
                <div className="goal-card__progress-labels">
                  <span>{goal.currentValue} / {goal.targetValue}</span>
                  <span>{goal.progressPercent}%</span>
                </div>
              </div>

              {goal.achieved && (
                <div className="goal-card__achieved">
                  <FiAward /> Achieved
                </div>
              )}

              <span className="goal-card__dates">
                {formatDate(goal.startDate)} – {formatDate(goal.endDate)}
              </span>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New goal">
        <form className="goal-form" onSubmit={handleSubmit((data) => createMutation.mutate(data))}>
          <Input label="Title" {...register("title", { required: true })} />
          <div className="goal-form__row">
            <div className="input-group">
              <label className="input-group__label">Timeframe</label>
              <div className="input-group__field">
                <select {...register("timeframe")}>
                  {TIMEFRAMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-group__label">Target Type</label>
              <div className="input-group__field">
                <select {...register("targetType")}>
                  <option value="profit">Profit ($)</option>
                  <option value="winRate">Win Rate (%)</option>
                  <option value="tradeCount">Trade Count</option>
                  <option value="riskDiscipline">Risk Discipline</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
          </div>
          <Input label="Target Value" type="number" step="any" {...register("targetValue", { required: true, valueAsNumber: true })} />
          <div className="goal-form__row">
            <Input label="Start Date" type="date" {...register("startDate", { required: true })} />
            <Input label="End Date" type="date" {...register("endDate", { required: true })} />
          </div>
          <div className="trade-form__actions">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Create goal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Goals;
