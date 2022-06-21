// jQuery Tetris plug-in
// by Alexander Gyoshev (http://blog.gyoshev.net/)
// licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License. (http://creativecommons.org/licenses/by-sa/3.0/)

// Modified for use with Mazda Infotainment System

(function($) {
  const extend = $.extend;
  const proxy = $.proxy;
  // const keys = {
  //   left: 37,
  //   up: 38,
  //   right: 39,
  //   down: 40,
  // };

  // jQuery plug-in
  const tetris = $.fn.tetris = function(options) {
    options = extend($.fn.tetris.defaults, options);

    return this.each(function() {
      const $this = $(this);
      let instance;
      if (!$this.data('tetris')) {
        instance = new impl(this, options);
        $this.data('tetris', instance);
      }
    });
  };

  // Tetris implementation
  const impl = tetris.implementation = function(element, options) {
    const $element = $(element);
    const that = this;

    extend(that, {
      element: element,
      $element: $element,
      frozen: {},
    }, options);

    that.currentTile = that.generateTile();

    $element
        .css({
          width: that.cols * that.tileSize,
          height: that.rows * that.tileSize,
        })
        .bind({
          repaint: proxy(that.repaint, that),
          tick: proxy(that.tick, that),
          tileDrop: proxy(that.tileDrop, that),
          rowCompleted: proxy(that.rowCompleted, that),
          // / TODO: handle gameOver event with dignity
        })
        .trigger('repaint');
  };


  tetris.defaults = {
    rows: 22,
    cols: 10,
    tileSize: 16,
  };

  impl.prototype = {
    handle: function(eventId) {
      if (this.isGameOver) {
        if (eventId == 'selectStart') {
          this.restartGame();
        }
      } else {
        switch (eventId) {
          case 'upStart':
          case 'ccw':
          case 'cw':
            this.rotate();
            break;

          case 'leftStart':
            this.move(-1);
            break;

          case 'rightStart':
            this.move(1);
            break;

          case 'downStart':
            this.down();
            break;
        }
      }
    },
    tick: function() {
      this.down();
      this.$element.trigger('repaint');
    },
    tileDrop: function() {
      const that = this;

      that.freeze(that.currentTile);

      that.$element.find('.current').remove();

      that.currentTile = that.generateTile();

      if (!that.isValidLocation(that.currentTile.shape)) {
        this.gameover();
      }
    },
    rowCompleted: function(e, rowStart) {
      const that = this;
      let i;
      const cols = that.cols;
      const tileSize = that.tileSize;

      that.$element.find('.frozen')
          .filter(function() {
            const index = $(this).data('index');
            return index - (index % cols) == rowStart;
          })
          .remove()
          .end()
          .filter(function() {
            const index = $(this).data('index');
            if (index - (index % cols) < rowStart)
            {return index - (index % cols) < rowStart;}
          })
          .css('top', function() {
            return parseInt($(this).css('top')) + tileSize;
          })
          .each(function() {
            const t = $(this);
            t.data('index', t.data('index') + cols);
          });

      for (i = rowStart; i < rowStart + cols; i++) {
        delete that.frozen[i];
      }

      for (i = rowStart - 1; i >= 0; i--) {
        if (that.frozen[i]) {
          that.frozen[i + cols] = true;
          delete that.frozen[i];
        }
      }
    },
    isValidLocation: function(location) {
      let i; let j;
      const cols = this.cols;
      const maxStageIndex = cols * this.rows;

      for (i = 0; i < location.length; i++) {
        if (location[i] < 0 || location[i] >= maxStageIndex ||
          this.frozen[location[i]]) {
          return false;
        }

        for (j = 0; j < i; j++) {
          if (((location[i] % cols == 0) && (location[j] % cols == cols - 1)) ||
            ((location[i] % cols == cols - 1) && (location[j] % cols == 0)))
          {return false;}
        }
      }

      return true;
    },
    move: function(modifier) {
      const that = this;
      let i;
      const cols = that.cols;
      const shape = that.currentTile.shape;
      const newLocation = $.map(shape, function(x) {
        return x + modifier;
      });
      let hitsEdge = false;

      for (i = 0; i < shape.length; i++) {
        if ((modifier < 0 && shape[i] % cols == 0) ||
          (modifier > 0 && shape[i] % cols == cols - 1)) {
          hitsEdge = true;
        }
      }

      if (!hitsEdge && that.isValidLocation(newLocation)) {
        that.currentTile.shape = newLocation;
        that.$element.trigger('repaint');
      }
    },
    rotate: function() {
      const that = this;
      const currentTile = that.currentTile;
      let newLocation = currentTile.shape.slice();
      let rotation;

      if (currentTile.shapeStates) {
        rotation = currentTile.shapeStates[currentTile.shapeStateIndex];

        newLocation = $.map(newLocation, function(x, index) {return x + rotation[index];});
      } else if (currentTile.shapeRotation) {
        newLocation = currentTile.shapeRotation(newLocation);
      }

      if (that.isValidLocation(newLocation)) {
        currentTile.shape = newLocation;
        if (currentTile.shapeStates) {
          currentTile.shapeStateIndex = (++currentTile.shapeStateIndex) % currentTile.shapeStates.length;
        }
      }

      that.$element.trigger('repaint');
    },
    down: function() {
      const that = this;
      const cols = that.cols;
      // const maxStageIndex = cols * that.rows;
      const shape = that.currentTile.shape;
      const newLocation = $.map(shape, function(x) {return x + cols;});

      if (that.isValidLocation(newLocation)) {
        that.currentTile.shape = newLocation;
        that.$element.trigger('repaint');
      } else {
        that.$element.trigger('tileDrop');
      }
    },
    generateTile: function(type) {
      // build shape cache
      const cols = this.cols;
      const center = Math.floor(cols / 2) + cols;
      const direction = [-cols, +1, +cols, -1];

      function squareRotation(shape) {
        const directions = [-cols - 1, -cols, -cols + 1, -1, 0, +1, +cols - 1, +cols, +cols + 1];
        const rotation = [-cols + 1, +1, +cols + 1, -cols, 0, +cols, -cols - 1, -1, +cols - 1];
        const center = shape[0];

        return $.map(shape, function(coord) {
          for (let i = 0; i < directions.length; i++) {
            if (coord == center + directions[i]) {
              return center + rotation[i];
            }
          }
        });
      }

      if (!this.tileCache) {
        // / TODO: allow extensibility for custom tiles
        // / TODO: move this somewhere else
        this.tileCache = [{
          type: 'O',
          shape: [center, center + 1, center + direction[0], center + direction[0] + 1],
        },
        {
          type: 'J',
          shape: [center, center - 1, center + 1, center - 1 + direction[0]],
          shapeRotation: squareRotation,
        },
        {
          type: 'L',
          shape: [center, center - 1, center + 1, center + 1 + direction[0]],
          shapeRotation: squareRotation,
        },
        {
          type: 'I',
          shape: [center - 1, center, center + 1, center + 2],
          shapeStates: [
            [+2 - cols, +1, +cols, +2 * cols - 1],
            [+1 + 2 * cols, +cols, -1, -2 - cols],
            [-2 + cols, -1, -cols, -2 * cols + 1],
            [-1 - 2 * cols, -cols, +1, +2 + cols],
          ],
          shapeStateIndex: 0,
        },
        {
          type: 'S',
          shape: [center, center - 1, center + direction[0], center + direction[0] + 1],
          shapeRotation: squareRotation,
        },
        {
          type: 'Z',
          shape: [center, center + 1, center + direction[0], center + direction[0] - 1],
          shapeRotation: squareRotation,
        },
        {
          type: 'T',
          shape: [center, center - 1, center + 1, center + direction[0]],
          shapeRotation: squareRotation,
        },
        ];
      }

      if (typeof type != 'undefined') {
        for (let i = 0; i < this.tileCache.length; i++) {
          if (this.tileCache[i].type == type) {
            tileIndex = i;
            break;
          }
        }
      } else {
        // Random Generator using Knuth shuffle (http://tetris.wikia.com/wiki/Random_Generator)
        if (!this.randomBag || this.randomBag.length == 0) {
          const tilesCount = this.tileCache.length;
          this.randomBag = [];

          for (let i = 0; i < tilesCount; i++) {
            this.randomBag[i] = i;
          }

          for (let i = tilesCount - 1; i > 0; i--) {
            const rand = Math.floor(Math.random() * i);
            const tmp = this.randomBag[rand];
            this.randomBag[rand] = this.randomBag[i];
            this.randomBag[i] = tmp;
          }
        }

        tileIndex = this.randomBag.shift();
      }

      return extend({}, this.tileCache[tileIndex], {shapeLocation: squareRotation});
    },
    freeze: function(tile) {
      const frozenTilesHtml = [];
      const shape = tile.shape;
      const tileSize = this.tileSize;
      const cols = this.cols;
      const rowsToCheck = [];

      for (let i = 0; i < shape.length; i++) {
        if ($.inArray(shape[i] - (shape[i] % cols), rowsToCheck) === -1) {
          rowsToCheck.push(shape[i] - (shape[i] % cols));
        }

        this.frozen[shape[i]] = true;
        frozenTilesHtml.push('<div class="tile frozen type-' + tile.type + '" />');
      }

      $(frozenTilesHtml.join(''))
          .each(function(i) {
            $(this).css({
              left: (shape[i] % cols) * tileSize,
              top: Math.floor(shape[i] / cols) * tileSize,
            })
                .data('index', shape[i]);
          })
          .appendTo(this.element);

      while (rowsToCheck.length) {
        const rowStart = rowsToCheck.shift();
        let broken = false;

        for (let i = rowStart; i < rowStart + cols; i++) {
          if (!this.frozen[i])
          {broken = true;}
        }

        if (!broken) {
          this.$element.trigger('rowCompleted', rowStart);
        }
      }
    },
    repaint: function() {
      const cols = this.cols;
      const tileSize = this.tileSize;
      const shape = this.currentTile.shape;
      let currentTile = this.$element.find('.current');

      if (currentTile.length == 0) {
        // render new tile
        const currentTileHtml = [];

        for (let h = 0; h < shape.length; h++) {
          currentTileHtml.push('<div class="tile current type-' + this.currentTile.type + '" />');
        }

        currentTile = this.$element.append(currentTileHtml.join('')).find('.current');
      }

      // position shape
      for (let i = 0; i < shape.length; i++) {
        currentTile.eq(i).css({
          left: (shape[i] % cols) * tileSize,
          top: Math.floor(shape[i] / cols) * tileSize,
        });
      }
    },
    start: function() {
      if (this.isStarted) return;
      this.isStarted = true;
      const $element = this.$element;

      if (!this.isValidLocation(this.currentTile.shape)) {
        this.gameover();
      }

      // / TODO: improve timer
      this.timer = setInterval(function() {
        $element.trigger('tick');
      }, 600);
    },
    pause: function() {
      this.isStarted = false;
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    },
    gameover: function() {
      this.isStarted = false;
      this.isGameOver = true;
      this.$element.trigger('gameOver');
    },
    restartGame: function() {
      this.$element.empty();
      this.$element.trigger('restartGame');
      this.isStarted = false;
      this.isGameOver = false;

      this.frozen = {};

      this.start();
    },
  };
})(jQuery);
