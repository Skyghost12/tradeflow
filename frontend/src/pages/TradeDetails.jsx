import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import Card from "../components/UI/Card";
import Badge from "../components/UI/Badge";
import Button from "../components/UI/Button";
import LoadingScreen from "../components/UI/LoadingScreen";
import { getTradeById, deleteTrade } from "../services/tradeService";
import { formatCurrency, formatDateTime, profitTone } from "../utils/format";
import "./TradeDetails.css";

const RESULT_TONE = { win: "bull", loss: "bear", breakeven: "gold", open: "info" };

const TradeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: trade, isLoading } = useQuery({
    queryKey: ["trade", id],
    queryFn: () => getTradeById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTrade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      navigate("/journal");
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (!trade) return null;

  const handleDelete = () => {
    if (confirm("Delete this trade? This can't be undone.")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="trade-details">
      <Link to="/journal" className="trade-details__back">
        <FiArrowLeft /> Back to journal
      </Link>

      <div className="trade-details__header">
        <div>
          <div className="trade-details__title">
            <h2>{trade.pair}</h2>
            <Badge tone={trade.direction === "long" ? "bull" : "bear"}>{trade.direction}</Badge>
            <Badge tone={RESULT_TONE[trade.result]}>{trade.result}</Badge>
          </div>
          <span className="trade-details__date">{formatDateTime(trade.date)}</span>
        </div>
        <Button variant="danger" icon={FiTrash2} onClick={handleDelete}>Delete</Button>
      </div>

      <div className="trade-details__grid">
        <Card>
          <h3>Levels</h3>
          <div className="detail-list">
            <div><span>Entry</span><span className="mono">{trade.entry}</span></div>
            <div><span>Stop Loss</span><span className="mono">{trade.stopLoss}</span></div>
            <div><span>Take Profit</span><span className="mono">{trade.takeProfit}</span></div>
            <div><span>Lot Size</span><span className="mono">{trade.lotSize}</span></div>
            <div><span>Risk %</span><span className="mono">{trade.riskPercent}%</span></div>
            <div><span>Risk:Reward</span><span className="mono">{trade.riskReward?.toFixed(2)}</span></div>
          </div>
        </Card>

        <Card>
          <h3>Context</h3>
          <div className="detail-list">
            <div><span>Strategy</span><span>{trade.strategy?.name || "—"}</span></div>
            <div><span>Emotion</span><span className="capitalize">{trade.emotion}</span></div>
            <div><span>Session</span><span className="capitalize">{trade.session || "—"}</span></div>
            <div>
              <span>Profit</span>
              <span className={`mono trade-details__profit--${profitTone(trade.profit)}`}>
                {formatCurrency(trade.profit)}
              </span>
            </div>
          </div>
        </Card>

        {trade.screenshot?.url && (
          <Card className="trade-details__screenshot-card">
            <h3>Screenshot</h3>
            <img src={trade.screenshot.url} alt={`${trade.pair} setup`} />
          </Card>
        )}

        {trade.notes && (
          <Card className="trade-details__notes-card">
            <h3>Notes</h3>
            <p>{trade.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TradeDetails;
