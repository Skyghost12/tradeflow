import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiTrash2, FiEdit2 } from "react-icons/fi";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Badge from "../components/UI/Badge";
import Modal from "../components/UI/Modal";
import EmptyState from "../components/UI/EmptyState";
import LoadingScreen from "../components/UI/LoadingScreen";
import TradeForm from "../components/Dashboard/TradeForm";
import { getTrades, createTrade, updateTrade, deleteTrade } from "../services/tradeService";
import { formatCurrency, formatDate, profitTone } from "../utils/format";
import "./Journal.css";

const RESULT_TONE = { win: "bull", loss: "bear", breakeven: "gold", open: "info" };

const Journal = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [sort, setSort] = useState("-date");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["trades", { search, resultFilter, sort }],
    queryFn: () =>
      getTrades({
        search: search || undefined,
        result: resultFilter || undefined,
        sort,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTrade(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setModalOpen(false);
      setEditingTrade(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const handleSubmit = (formData) => {
    const payload = { ...formData, strategy: formData.strategy || undefined };
    if (editingTrade) {
      updateMutation.mutate({ id: editingTrade._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const openCreateModal = () => {
    setEditingTrade(null);
    setModalOpen(true);
  };

  const openEditModal = (trade, e) => {
    e.preventDefault();
    setEditingTrade(trade);
    setModalOpen(true);
  };

  const handleDelete = (id, e) => {
    e.preventDefault();
    if (confirm("Delete this trade? This can't be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="journal">
      <div className="journal__toolbar">
        <div className="journal__search">
          <FiSearch />
          <input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="journal__filter"
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
        >
          <option value="">All results</option>
          <option value="win">Wins</option>
          <option value="loss">Losses</option>
          <option value="breakeven">Breakeven</option>
          <option value="open">Open</option>
        </select>

        <select className="journal__filter" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="-date">Newest first</option>
          <option value="date">Oldest first</option>
          <option value="-profit">Profit: high to low</option>
          <option value="profit">Profit: low to high</option>
        </select>

        <Button icon={FiPlus} onClick={openCreateModal}>Log trade</Button>
      </div>

      <Card padded={false}>
        {isLoading ? (
          <LoadingScreen />
        ) : data?.trades?.length === 0 ? (
          <EmptyState
            title="No trades match your filters"
            message="Log your first trade or adjust your search."
            action={<Button icon={FiPlus} onClick={openCreateModal}>Log trade</Button>}
          />
        ) : (
          <div className="journal-table">
            <div className="journal-table__head">
              <span>Pair</span>
              <span>Direction</span>
              <span>Entry</span>
              <span>R:R</span>
              <span>Result</span>
              <span>Profit</span>
              <span>Date</span>
              <span></span>
            </div>
            {data?.trades?.map((trade) => (
              <Link to={`/journal/${trade._id}`} key={trade._id} className="journal-table__row">
                <span className="journal-table__pair">{trade.pair}</span>
                <Badge tone={trade.direction === "long" ? "bull" : "bear"}>{trade.direction}</Badge>
                <span className="mono">{trade.entry}</span>
                <span className="mono">{trade.riskReward?.toFixed(2)}</span>
                <Badge tone={RESULT_TONE[trade.result]}>{trade.result}</Badge>
                <span className={`mono journal-table__profit--${profitTone(trade.profit)}`}>
                  {formatCurrency(trade.profit)}
                </span>
                <span className="journal-table__date">{formatDate(trade.date)}</span>
                <span className="journal-table__actions">
                  <button onClick={(e) => openEditModal(trade, e)} aria-label="Edit"><FiEdit2 /></button>
                  <button onClick={(e) => handleDelete(trade._id, e)} aria-label="Delete"><FiTrash2 /></button>
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTrade ? "Edit trade" : "Log a new trade"}
        width="720px"
      >
        <TradeForm
          defaultValues={
            editingTrade
              ? { ...editingTrade, date: new Date(editingTrade.date).toISOString().slice(0, 16) }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default Journal;
