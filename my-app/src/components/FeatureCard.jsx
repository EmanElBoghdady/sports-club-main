import { motion } from "framer-motion";
function FeatureCard({ icon, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl flex items-center gap-3 backdrop-blur-sm hover:border-emerald-500/50 transition-all cursor-pointer group"
    >
      <div className="text-emerald-500 transition-transform group-hover:scale-110">{icon}</div>
      <h5 className="font-bold text-slate-100 text-sm">{text}</h5>
    </motion.div>
  );
}

export default FeatureCard;