import { useState, useEffect } from 'react';
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../utils/api';


export function EmployerDashboard() {

  const [stats, setStats] = useState({});
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/employeer/dashboard");

        if (res.data.success) {
          setStats(res.data.data.cards);
          setApplicants(res.data.data.recent_applicants);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  // ✅ Dynamic cards
  const cards = [
    {
      label: 'Active Jobs',
      value: stats.active_jobs || 0,
      delta: `${stats.new_jobs || 0} new`,
      icon: Briefcase,
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary'
    },
    {
      label: 'Total Applicants',
      value: stats.total_applicants || 0,
      delta: `${stats.shortlisted || 0} shortlisted`,
      icon: Users,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'Job Views',
      value: stats.views || 0,
      delta: `+0`,
      icon: Eye,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'New This Week',
      value: stats.new_this_week || 0,
      delta: 'applicants',
      icon: TrendingUp,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500'
    }
  ];

  return (
    <div className="space-y-6">

      {/* ✅ Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border p-4 shadow-sm"
          >
            <div className="flex justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.iconColor}`} />
              </div>
              <span className="text-xs text-emerald-600 font-semibold">
                {stat.delta}
              </span>
            </div>

            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ✅ Recent Applicants */}
      <div className="bg-white rounded-2xl border p-5">
        <h2 className="text-lg font-bold mb-4">Recent Applicants</h2>

        {applicants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applicants yet</p>
        ) : (
          applicants.map((app, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-bold">
                  {app.name?.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold">{app.position}</p>
                  <p className="text-sm text-muted-foreground">{app.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs">{app.appliedDate}</p>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {app.status}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}