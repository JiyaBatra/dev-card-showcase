// Rock-Paper-Scissors Game Logic

class RockPaperScissorsGame {
    constructor() {
        // Game state
        this.playerScore = 0;
        this.computerScore = 0;
        this.tieScore = 0;
        this.playerStats = {
            rock: 0,
            paper: 0,
            scissors: 0
        };
        this.streak = 0;
        this.streakType = ''; // 'win', 'loss', or ''
        this.isPlaying = false;

        // DOM Elements
        this.choiceButtons = document.querySelectorAll('.choice-btn');
        this.playerChoiceDisplay = document.getElementById('playerChoiceDisplay');
        this.computerChoiceDisplay = document.getElementById('computerChoiceDisplay');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.playerScoreDisplay = document.getElementById('playerScore');
        this.computerScoreDisplay = document.getElementById('computerScore');
        this.tieScoreDisplay = document.getElementById('tieScore');
        this.statsModal = document.getElementById('statsModal');
        this.gameAnnouncement = document.getElementById('gameAnnouncement');

        // Load saved game data
        this.loadGameData();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // Choice buttons
        this.choiceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.playGame(choice);
            });

            // Keyboard shortcut labels
            const choice = btn.dataset.choice;
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.playGame(choice);
                }
            });
        });

        // Modal controls
        document.getElementById('statsBtn').addEventListener('click', () => this.openStatsModal());
        document.getElementById('closeStatsBtn').addEventListener('click', () => this.closeStatsModal());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.querySelector('.close-btn').addEventListener('click', () => this.closeStatsModal());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Close modal on outside click
        this.statsModal.addEventListener('click', (e) => {
            if (e.target === this.statsModal) {
                this.closeStatsModal();
            }
        });
    }

    handleKeyboardShortcuts(e) {
        const key = e.key.toLowerCase();

        if (key === 'r') {
            e.preventDefault();
            this.playGame('rock');
        } else if (key === 'p') {
            e.preventDefault();
            this.playGame('paper');
        } else if (key === 's') {
            e.preventDefault();
            this.playGame('scissors');
        }
    }

    playGame(playerChoice) {
        if (this.isPlaying) return;

        this.isPlaying = true;

        // Generate computer choice
        const computerChoice = this.getComputerChoice();

        // Track player stats
        this.playerStats[playerChoice]++;

        // Determine result
        const result = this.determineWinner(playerChoice, computerChoice);

        // Update scores
        if (result === 'win') {
            this.playerScore++;
            this.updateStreak('win');
        } else if (result === 'lose') {
            this.computerScore++;
            this.updateStreak('loss');
        } else {
            this.tieScore++;
            this.updateStreak('tie');
        }

        // Animate the game
        this.animateGame(playerChoice, computerChoice, result);

        // Save game data
        this.saveGameData();
    }

    getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    }

    determineWinner(player, computer) {
        if (player === computer) {
            return 'tie';
        }

        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'win';
        }

        return 'lose';
    }

    updateStreak(result) {
        if (result === this.streakType) {
            if (result !== 'tie') {
                this.streak++;
            } else {
                this.streak = 0;
                this.streakType = '';
            }
        } else {
            this.streak = 1;
            this.streakType = result;
        }

        // Reset tie streaks
        if (result === 'tie') {
            this.streak = 0;
            this.streakType = '';
        }
    }

    getChoiceEmoji(choice) {
        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        return emojis[choice] || '❓';
    }

    animateGame(playerChoice, computerChoice, result) {
        // Clear previous displays
        this.playerChoiceDisplay.textContent = '';
        this.computerChoiceDisplay.textContent = '';
        this.resultDisplay.innerHTML = '';

        // Animate player choice with flip effect
        setTimeout(() => {
            this.playerChoiceDisplay.innerHTML = `<span class="choice-emoji">${this.getChoiceEmoji(playerChoice)}</span>`;
            this.playerChoiceDisplay.parentElement.parentElement.classList.add('active');
        }, 100);

        // Animate computer choice with flip effect
        setTimeout(() => {
            this.computerChoiceDisplay.innerHTML = `<span class="choice-emoji">${this.getChoiceEmoji(computerChoice)}</span>`;
            this.computerChoiceDisplay.parentElement.parentElement.classList.add('active');
        }, 300);

        // Show result
        setTimeout(() => {
            const resultText = this.getResultText(result);
            this.resultDisplay.classList.add(result);
            this.resultDisplay.innerHTML = `<p class="result-text">${resultText}</p>`;
            this.gameAnnouncement.textContent = `${resultText}. You chose ${playerChoice}, computer chose ${computerChoice}.`;

            // Update displays
            this.updateDisplay();
        }, 800);

        // reset animation states
        setTimeout(() => {
            this.playerChoiceDisplay.parentElement.parentElement.classList.remove('active');
            this.computerChoiceDisplay.parentElement.parentElement.classList.remove('active');
            this.resultDisplay.classList.remove('win', 'lose', 'tie');
            this.isPlaying = false;
        }, 1800);
    }

    getResultText(result) {
        const results = {
            win: '🎉 You Win!',
            lose: '😔 You Lose!',
            tie: '🤝 It\'s a Tie!'
        };
        return results[result] || 'Play Again';
    }

    updateDisplay() {
        this.playerScoreDisplay.textContent = this.playerScore;
        this.computerScoreDisplay.textContent = this.computerScore;
        this.tieScoreDisplay.textContent = this.tieScore;

        // Update stats
        const totalGames = this.playerScore + this.computerScore + this.tieScore;
        const winRate = totalGames > 0 ? Math.round((this.playerScore / totalGames) * 100) : 0;

        document.getElementById('winRate').textContent = winRate + '%';
        document.getElementById('totalGames').textContent = totalGames;
        document.getElementById('streak').textContent = this.streakType !== '' ? this.streak : 0;
    }

    openStatsModal() {
        const totalGames = this.playerScore + this.computerScore + this.tieScore;
        const winPercent = totalGames > 0 ? Math.round((this.playerScore / totalGames) * 100) : 0;
        const totalChoices = this.playerStats.rock + this.playerStats.paper + this.playerStats.scissors;

        // Update modal content
        document.getElementById('modalWins').textContent = this.playerScore;
        document.getElementById('modalLosses').textContent = this.computerScore;
        document.getElementById('modalTies').textContent = this.tieScore;
        document.getElementById('modalWinPercent').textContent = winPercent + '%';
        document.getElementById('modalStreak').textContent = this.streakType !== '' ? this.streak : 0;

        // Most used choice
        let mostUsed = '--';
        if (totalChoices > 0) {
            let max = Math.max(
                this.playerStats.rock,
                this.playerStats.paper,
                this.playerStats.scissors
            );
            if (max > 0) {
                if (this.playerStats.rock === max) mostUsed = '🪨 Rock';
                else if (this.playerStats.paper === max) mostUsed = '📄 Paper';
                else if (this.playerStats.scissors === max) mostUsed = '✂️ Scissors';
            }
        }
        document.getElementById('modalMostUsed').textContent = mostUsed;

        // Update choice distribution
        document.getElementById('rockCount').textContent = this.playerStats.rock;
        document.getElementById('paperCount').textContent = this.playerStats.paper;
        document.getElementById('scissorsCount').textContent = this.playerStats.scissors;

        // Update progress bars
        if (totalChoices > 0) {
            document.getElementById('rockBar').style.width = (this.playerStats.rock / totalChoices) * 100 + '%';
            document.getElementById('paperBar').style.width = (this.playerStats.paper / totalChoices) * 100 + '%';
            document.getElementById('scissorsBar').style.width = (this.playerStats.scissors / totalChoices) * 100 + '%';
        }

        this.statsModal.classList.remove('hidden');
        document.getElementById('closeStatsBtn').focus();
    }

    closeStatsModal() {
        this.statsModal.classList.add('hidden');
    }

    resetGame() {
        if (confirm('Are you sure you want to reset all scores and statistics?')) {
            this.playerScore = 0;
            this.computerScore = 0;
            this.tieScore = 0;
            this.playerStats = { rock: 0, paper: 0, scissors: 0 };
            this.streak = 0;
            this.streakType = '';

            this.updateDisplay();
            this.saveGameData();
            this.gameAnnouncement.textContent = 'Game has been reset. All scores cleared.';
            this.closeStatsModal();
        }
    }

    // Local Storage
    saveGameData() {
        const gameData = {
            playerScore: this.playerScore,
            computerScore: this.computerScore,
            tieScore: this.tieScore,
            playerStats: this.playerStats,
            streak: this.streak,
            streakType: this.streakType,
            lastPlayed: new Date().toISOString()
        };
        localStorage.setItem('rpsGameData', JSON.stringify(gameData));
    }

    loadGameData() {
        const saved = localStorage.getItem('rpsGameData');
        if (saved) {
            const gameData = JSON.parse(saved);
            this.playerScore = gameData.playerScore || 0;
            this.computerScore = gameData.computerScore || 0;
            this.tieScore = gameData.tieScore || 0;
            this.playerStats = gameData.playerStats || { rock: 0, paper: 0, scissors: 0 };
            this.streak = gameData.streak || 0;
            this.streakType = gameData.streakType || '';
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new RockPaperScissorsGame();
    console.log('Rock-Paper-Scissors Game loaded!');
});
