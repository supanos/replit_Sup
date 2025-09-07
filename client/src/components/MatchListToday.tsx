import { useQuery } from "@tanstack/react-query";
import { Tv, Clock } from "lucide-react";
import Badge from "@/components/Badge";

type Match = {
  id: string; 
  league: string;
  homeTeam: string; 
  awayTeam: string; 
  datetime: string;
  status?: 'scheduled' | 'in-progress' | 'final';
  venue?: string; 
  channel?: string;
};

export default function MatchListToday() {
  const { data: games, isLoading, error } = useQuery<Match[]>({
    queryKey: ['/api/games/today'],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  if (error) return <p className="text-red-300">Could not load today's matches.</p>;
  if (isLoading) return <p className="text-gray-300">Loading today's matches...</p>;
  if (!games || games.length === 0) return <p className="text-gray-300">No games scheduled for today. Check back later!</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {games.map(game => (
        <div key={game.id} className="bg-brand-navy rounded-xl p-6 shadow-2xl border border-brand-gold/20" data-testid={`game-card-${game.id}`}>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="league">{game.league}</Badge>
            {game.channel && (
              <div className="flex items-center text-brand-gold">
                <Tv className="w-4 h-4 mr-2" />
                <span className="text-sm">{game.channel}</span>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-white">{game.awayTeam}</div>
                <div className="text-sm text-gray-400">AWAY</div>
              </div>
              <div className="text-brand-gold font-anton text-2xl">@</div>
              <div className="text-center flex-1">
                <div className="text-lg font-bold text-white">{game.homeTeam}</div>
                <div className="text-sm text-gray-400">HOME</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center text-brand-gold font-bold text-lg">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(game.datetime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
              </div>
              
              {game.venue && (
                <div className="text-sm text-gray-400">{game.venue}</div>
              )}
              
              {game.status && game.status !== 'scheduled' && (
                <div className="flex items-center justify-center gap-2">
                  {game.status === 'in-progress' && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 font-bold text-xs">LIVE</span>
                    </div>
                  )}
                  <span className={
                    'inline-block rounded-full px-3 py-1 text-xs font-semibold ' +
                    (game.status === 'in-progress' ? 'bg-red-500/20 text-red-300 ring-1 ring-red-400/40' :
                     game.status === 'final' ? 'bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40' :
                                               'bg-white/10 text-white ring-1 ring-white/20')
                  }>
                    {game.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}