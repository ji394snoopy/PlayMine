// level: 0 等級
// mineSize: 0 區域大小
// mineCount: 0 地雷數量
// Mines: [] 地雷
//
// x: j, 位置x
// y: i, 位置y
// flag: false, 是否被插旗
// bomb: false, 是否有炸彈
// clickable: true, 可否被點擊(flag/已點開後不能點)
// isClicked: false, 是否被點擊
// count: 0 附近炸彈數量
var timerInterval = null;

$(document).ready(function() {
    var vm = new Vue({
        el: "#mineArea",
        data: {
            level: 0,
            mineSize: 0,
            mineCount: 0,
            Mines: [],
            bomb: [],
            isFlaging: false,
            isTicking: false,
            timer: {
                start: 0,
                mm: 0,
                ss: 0
            },
            isgg: false
        },
        watch: {
            isTicking: function(change) {
                if (change) {
                    this.timer.start = Date.now();
                    timerInterval = setInterval(this.timerCount, 1000);
                } else {
                    clearInterval(timerInterval);
                }
            }
        },
        methods: {
            initMineArea: function(lev) {
                this.level = lev;
                this.Mines = [];
                this.isTicking = false;
                this.timer = {
                    start: 0,
                    mm: 0,
                    ss: 0
                };
                //選擇區域大小
                switch (this.level) {
                    case 0:
                        this.mineSize = 5;
                        this.mineCount = this.mineSize;
                        break;
                    case 1:
                        this.mineSize = 7;
                        this.mineCount = this.mineSize;
                        break;
                    case 2:
                        this.mineSize = 10;
                        this.mineCount = this.mineSize;
                        break;
                    default:
                        this.mineSize = 5;
                        break;
                }
                var limit = this.mineSize;
                //初始埋下地雷
                for (var i = 0; i < limit; i++) {
                    var col = [];
                    for (var j = 0; j < limit; j++) {
                        var mine = {
                            x: j,
                            y: i,
                            flag: false,
                            bomb: false,
                            clickable: true,
                            isClicked: false,
                            count: 0
                        };
                        col.push(mine);
                    }
                    this.Mines.push(col);
                }
                //設定炸彈
                var tempbombs = [];
                for (i = 0; i < this.mineCount; i++) {
                    var temp;
                    do {
                        temp = returnBombPoint(limit);
                    } while (findSameXY(tempbombs, temp));
                    //設定地雷區炸彈
                    this.Mines[temp.y][temp.x].bomb = true;
                    this.Mines[temp.y][temp.x].count = -1;
                    tempbombs.push(temp);
                }
                this.bomb = tempbombs;

                console.log(this.bomb);
                //計算count
                for (var i = this.bomb.length - 1; i >= 0; i--) {
                    var x = this.bomb[i].x;
                    var y = this.bomb[i].y;
                    //跑一次身邊九宮格
                    //左上
                    if (x - 1 >= 0 && y - 1 >= 0) {
                        if (!this.Mines[y - 1][x - 1].bomb) { this.Mines[y - 1][x - 1].count += 1; }
                    }
                    //上
                    if (y - 1 >= 0) {
                        if (!this.Mines[y - 1][x].bomb) { this.Mines[y - 1][x].count += 1; }
                    }
                    //右上
                    if (x + 1 < limit && y - 1 >= 0) {
                        if (!this.Mines[y - 1][x + 1].bomb) { this.Mines[y - 1][x + 1].count += 1; }
                    }
                    //左
                    if (x - 1 >= 0) {
                        if (!this.Mines[y][x - 1].bomb) { this.Mines[y][x - 1].count += 1; }
                    }
                    //右
                    if (x + 1 < limit) {
                        if (!this.Mines[y][x + 1].bomb) { this.Mines[y][x + 1].count += 1; }
                    }
                    //左下
                    if (x - 1 >= 0 && y + 1 < limit) {
                        if (!this.Mines[y + 1][x - 1].bomb) { this.Mines[y + 1][x - 1].count += 1; }
                    }
                    //下
                    if (y + 1 < limit) {
                        if (!this.Mines[y + 1][x].bomb) { this.Mines[y + 1][x].count += 1; }
                    }
                    //右下
                    if (x + 1 < limit && y + 1 < limit) {
                        if (!this.Mines[y + 1][x + 1].bomb) { this.Mines[y + 1][x + 1].count += 1; }
                    }
                }
            },
            mineOnClick: function(mine) {
                if (!this.isTicking) {
                    this.isTicking = true;
                }
                if (mine.count == 0) {
                    this.checkZero(mine);
                }
                if (mine.count == -1) {
                    this.isTicking = false;
                    this.isgg = true;
                }
                mine.isClicked = true;
            },
            flagOnClick: function(mine) {
                if (mine.flag) {
                    mine.flag = false;
                    mine.clickable = true;
                } else {
                    mine.flag = true;
                    mine.clickable = false;
                }
            },
            checkZero: function(mine) {
                var x = mine.x,
                    y = mine.y,
                    limit = this.mineSize;
                //console.log('x: ' + x + ', y: ' + y);
                if (mine.isClicked || mine.flag) {
                    //return true;
                } else if (mine.count > 0) {
                    mine.isClicked = true;
                } else if (mine.count === 0) {
                    mine.isClicked = true;
                    ///FROM HERE////
                    //跑一次身邊九宮格
                    //左上
                    if (x - 1 >= 0 && y - 1 >= 0) {
                        this.checkZero(this.Mines[y - 1][x - 1]);
                    }
                    //上
                    if (y - 1 >= 0) {
                        this.checkZero(this.Mines[y - 1][x]);
                    }
                    //右上
                    if (x + 1 < limit && y - 1 >= 0) {
                        this.checkZero(this.Mines[y - 1][x + 1]);
                    }
                    //左
                    if (x - 1 >= 0) {
                        this.checkZero(this.Mines[y][x - 1]);
                    }
                    //右
                    if (x + 1 < limit) {
                        this.checkZero(this.Mines[y][x + 1]);
                    }
                    //左下
                    if (x - 1 >= 0 && y + 1 < limit) {
                        this.checkZero(this.Mines[y + 1][x - 1]);
                    }
                    //下
                    if (y + 1 < limit) {
                        this.checkZero(this.Mines[y + 1][x]);
                    }
                    //右下
                    if (x + 1 < limit && y + 1 < limit) {
                        this.checkZero(this.Mines[y + 1][x + 1]);
                    }
                }
            },
            timerCount: function() {
                var d = Date.now(),
                    diff = d - this.timer.start;
                this.timer.mm = Math.floor(diff / 60000);
                this.timer.ss = Math.floor((diff % 60000) / 1000);
            }
        }
    });
    vm.initMineArea(2);
});



function returnBombPoint(limit) {
    var theNumber = Math.random();
    var x = Math.floor(theNumber * 100 % limit);
    theNumber = Math.random();
    var y = Math.floor(theNumber * 100 % limit);
    return { "x": x, "y": y };
}

function findSameXY(compareArr, obj) {
    for (var i = compareArr.length - 1; i >= 0; i--) {
        if (compareArr[i].x >= 0 && obj.x >= 0) {
            if (compareArr[i].x == obj.x && compareArr[i].y == obj.y) {
                return true;
            }
        } else {
            return false;
        }
    }
    return false;
}
