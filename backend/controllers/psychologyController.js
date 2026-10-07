import PsychologyLog from "../models/PsychologyLog.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const createLog = asyncHandler(async (req, res) => {
  const log = await PsychologyLog.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, log });
});

export const getLogs = asyncHandler(async (req, res) => {
  const logs = await PsychologyLog.find({ user: req.user._id }).sort("-date");
  res.json({ success: true, logs });
});

export const updateLog = asyncHandler(async (req, res) => {
  const log = await PsychologyLog.findOne({ _id: req.params.id, user: req.user._id });
  if (!log) throw new AppError("Log not found", 404);
  Object.assign(log, req.body);
  await log.save();
  res.json({ success: true, log });
});

export const deleteLog = asyncHandler(async (req, res) => {
  const log = await PsychologyLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!log) throw new AppError("Log not found", 404);
  res.json({ success: true, message: "Log deleted" });
});

// @desc    Aggregate emotional patterns — e.g. does low sleep correlate
//          with lower discipline scores, which emotions precede losses
// @route   GET /api/psychology/report
export const getPsychologyReport = asyncHandler(async (req, res) => {
  const logs = await PsychologyLog.find({ user: req.user._id }).sort("date");
  if (logs.length === 0) {
    return res.json({ success: true, report: null, message: "No psychology data logged yet" });
  }

  const avg = (arr) => Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2));

  const emotionBeforeCounts = {};
  const emotionAfterCounts = {};
  for (const log of logs) {
    emotionBeforeCounts[log.emotionBefore] = (emotionBeforeCounts[log.emotionBefore] || 0) + 1;
    emotionAfterCounts[log.emotionAfter] = (emotionAfterCounts[log.emotionAfter] || 0) + 1;
  }

  // Correlate sleep hours with discipline score (simple bucket comparison)
  const lowSleepLogs = logs.filter((l) => l.sleepHours < 6);
  const goodSleepLogs = logs.filter((l) => l.sleepHours >= 6);

  res.json({
    success: true,
    report: {
      averageConfidence: avg(logs.map((l) => l.confidence)),
      averageStress: avg(logs.map((l) => l.stressLevel)),
      averageSleepHours: avg(logs.map((l) => l.sleepHours)),
      averageDiscipline: avg(logs.map((l) => l.disciplineScore)),
      emotionBeforeBreakdown: emotionBeforeCounts,
      emotionAfterBreakdown: emotionAfterCounts,
      sleepImpact: {
        disciplineOnLowSleep: lowSleepLogs.length
          ? avg(lowSleepLogs.map((l) => l.disciplineScore))
          : null,
        disciplineOnGoodSleep: goodSleepLogs.length
          ? avg(goodSleepLogs.map((l) => l.disciplineScore))
          : null,
      },
      totalEntries: logs.length,
    },
  });
});
