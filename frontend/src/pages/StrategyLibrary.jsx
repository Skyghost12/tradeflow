import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import Input from "../components/UI/Input";
import Badge from "../components/UI/Badge";
import EmptyState from "../components/UI/EmptyState";
import LoadingScreen from "../components/UI/LoadingScreen";
import {
  getStrategies,
  createStrategy,
  updateStrategy,
  deleteStrategy,
} from "../services/strategyService";
import { formatPercent } from "../utils/format";
import "./StrategyLibrary.css";

const StrategyLibrary = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: strategies = [], isLoading } = useQuery({
    queryKey: ["strategies"],
    queryFn: getStrategies,
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", rules: "", entryConditions: "", exitConditions: "" });
    setModalOpen(true);
  };

  const openEdit = (strategy) => {
    setEditing(strategy);
    reset(strategy);
    setModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: createStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateStrategy(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStrategy,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["strategies"] }),
  });

  const onSubmit = (data) => {
    if (editing) updateMutation.mutate({ id: editing._id, payload: data });
    else createMutation.mutate(data);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this strategy?")) deleteMutation.mutate(id);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="strategy-library">
      <div className="strategy-library__toolbar">
        <Button icon={FiPlus} onClick={openCreate}>New strategy</Button>
      </div>

      {strategies.length === 0 ? (
        <EmptyState
          title="No strategies documented yet"
          message="Write down your rules once, then measure which setups actually earn their keep."
          action={<Button icon={FiPlus} onClick={openCreate}>New strategy</Button>}
        />
      ) : (
        <div className="strategy-library__grid">
          {strategies.map((strategy) => (
            <Card key={strategy._id} hoverable className="strategy-card">
              <div className="strategy-card__head">
                <h3>{strategy.name}</h3>
                <div className="strategy-card__actions">
                  <button onClick={() => openEdit(strategy)} aria-label="Edit"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(strategy._id)} aria-label="Delete"><FiTrash2 /></button>
                </div>
              </div>

              <div className="strategy-card__stats">
                <Badge tone="gold">{formatPercent(strategy.winRate)} win rate</Badge>
                <Badge tone="neutral">{strategy.tradesUsed} trades</Badge>
              </div>

              {strategy.entryConditions && (
                <div className="strategy-card__section">
                  <span>Entry</span>
                  <p>{strategy.entryConditions}</p>
                </div>
              )}
              {strategy.exitConditions && (
                <div className="strategy-card__section">
                  <span>Exit</span>
                  <p>{strategy.exitConditions}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit strategy" : "New strategy"}
        width="640px"
      >
        <form className="strategy-form" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Strategy Name" {...register("name", { required: true })} />
          <div className="input-group">
            <label className="input-group__label">Rules</label>
            <div className="input-group__field">
              <textarea rows={3} {...register("rules")} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-group__label">Entry Conditions</label>
            <div className="input-group__field">
              <textarea rows={3} {...register("entryConditions")} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-group__label">Exit Conditions</label>
            <div className="input-group__field">
              <textarea rows={3} {...register("exitConditions")} />
            </div>
          </div>
          <div className="trade-form__actions">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Save strategy</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StrategyLibrary;
