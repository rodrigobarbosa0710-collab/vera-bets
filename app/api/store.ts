// Store global para dados em memória
export const appStore = {
  players: new Map<string, any>(),
  bets: [] as any[],

  addBet(gameId: number, playerName: string, goals1: number, goals2: number) {
    const existingIndex = this.bets.findIndex(
      (b) => b.game_id === gameId && b.player_name === playerName
    );

    const newBet = {
      id: this.bets.length + 1,
      game_id: gameId,
      player_name: playerName,
      goals1,
      goals2,
      points: 5,
    };

    if (existingIndex >= 0) {
      this.bets[existingIndex] = newBet;
    } else {
      this.bets.push(newBet);
    }

    this.updatePlayerPoints(playerName);
    return newBet;
  },

  registerPlayer(playerName: string) {
    if (!this.players.has(playerName)) {
      this.players.set(playerName, {
        name: playerName,
        total_points: 0,
        paid_pix: false,
      });
    }
  },

  updatePlayerPoints(playerName: string) {
    const playerBets = this.bets.filter((b) => b.player_name === playerName);
    const totalPoints = playerBets.reduce((sum, b) => sum + (b.points || 0), 0);

    const player = this.players.get(playerName) || { name: playerName, total_points: 0, paid_pix: false };
    player.total_points = totalPoints;
    this.players.set(playerName, player);
  },

  getPlayerBets(playerName: string) {
    return this.bets.filter((b) => b.player_name === playerName);
  },

  getRanking() {
    return Array.from(this.players.values())
      .sort((a, b) => b.total_points - a.total_points)
      .map((player, index) => ({
        position: index + 1,
        name: player.name,
        points: player.total_points,
        paidPix: player.paid_pix,
      }));
  },

  togglePlayerPayment(playerName: string) {
    const player = this.players.get(playerName);
    if (player) {
      player.paid_pix = !player.paid_pix;
      this.players.set(playerName, player);
    }
  },

  getAllPlayers() {
    return Array.from(this.players.values());
  },
};
