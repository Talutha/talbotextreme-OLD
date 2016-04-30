exports.lineUp = {
  lineInProgress: false,
  inLine: [],
  lineCost: 0,
  lineDesc: 'none',
  lineStarter: 'no one',

  startaline: function() {
    if (this.lineInProgress) {
      return 'A line has already been started.'
    } else {
      this.lineInProgress = true;
      this.inLine = [];
      return this.lineStarter + ' has started a line for: ' + this.lineDesc + ' - !lineup for ' + this.lineCost + ' points!'
    };
  },

  lineUp: function(user, sub) {
    if (!this.lineInProgress) {
      return false;
    } else if (this.inLine.indexOf(user) <= 0) {
      if (sub) {
        this.inLine.push(user);
      };
      this.inLine.push(user);
      return 'accepted';
    } else {
      return 'duplicated';
    };
  },

  select: function() {
    var winner = this.inLine[Math.floor(Math.random() * this.inLine.length)];
    this.remove(winner);
    return winner;
  },

  remove: function(user) {
    while(this.inLine.indexOf(user) > -1) {
      index = this.inLine.indexOf(user);
      this.inLine.splice(index, 1);
    };
  }

};
