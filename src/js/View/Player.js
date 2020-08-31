import UnitBase from "js/View/UnitBase";
import HitTest from "js/Util/HitTest";
import Bullet from "./Bullet";

/**
 * 自機クラス
 */
export default class Player extends UnitBase {
    constructor () {
        super ();
        this.x = 100;
        this.y = 200;
        this.setHP(100);
        this.setWidth(40);
        this.setHeight(40);

        this.xFlag = false; //戻るタイミング他にないので更新毎で初期値へ
        this.yFlag = false;
        this.diagonal = 1;

        this.rightFlag = false;
        this.leftFlag = false;
        this.upFlag = false;
        this.downFlag = false;

        this.shootFlag = false;
        this.shootTimer = 180;

        window.addEventListener('keydown',(e) => {
          switch(e.keyCode){ //キー押しっぱはkeydown→keypressを繰り返す為、1fずつタイミング空くのでフラグで立ち上がりとオンをとる
            case 39 : this.rightFlag = true;
            break;
            case 37 : this.leftFlag = true;
            break;
            case 40 : this.upFlag = true;
            break;
            case 38 : this.downFlag = true;
            break;
            case 32 : this.shootFlag = true;
            break;
          }
        },false);

        window.addEventListener('keyup',(e) => {
          switch(e.keyCode){
            case 39 : this.rightFlag = false;
            break;
            case 37 : this.leftFlag = false;
            break;
            case 40 : this.upFlag = false;
            break;
            case 38 : this.downFlag = false;
            break;
            case 32 : this.shootFlag = false;
            break;
          }
        },false);
    }

    /**
     * EnterFrame.jsの中で
     * requestAnimationFrameから自動的にcallされ続けます。
     */
    update () {
      console.log(this.shootFlag);
        // 矢印キー　←↑→↓で動くようにしてください。googleで「js keycode」など検索してみて下さい。
        if(this.rightFlag || this.leftFlag){
          this.xFlag = true;
        } else{
          this.xFlag = false;
        }
        if(this.upFlag || this.downFlag){
          this.yFlag = true;
        } else{
          this.yFlag = false;
        }
        if(this.xFlag && this.yFlag){ //斜め移動判定
          this.diagonal = Math.sqrt(2); //斜め移動の時xyに√2を掛けて足すことで、斜めに1.141でなく1移動させる
        } else{
          this.diagonal = 1;
        }

        this.x += (this.rightFlag - this.leftFlag) * 4 / this.diagonal; //4は移動スピード
        this.y += (this.upFlag - this.downFlag) * 4 / this.diagonal;

        // スペースキーを押すとBulletが発射されるようにして下さい。
        // Enemyクラスを参考にしてください。
        if(this.shootFlag && this.shootTimer > 10){
          let bullet = new Bullet (this.x + this.x / 2, this.y);
          bullet.setSpeed(4);
          this.shootTimer = 0;
          console.log("shoot");
        }
        this.shootTimer++;

        // 敵の弾に当たったらダメージを受けるようにして下さい。
        const bullet = HitTest.getHitObjectByClassName(this, "Bullet");
        if(bullet) {
            // ダメージを与えて下さい。↓コメントアウトを外していただくですがw
            // this.setDamage (bullet.damage);
            // ↑さて、setDamageはどこで定義されているでしょうか？

            // HPが0になったら死亡状態にし、MainManageに通知して下さい。
            // そして、MainManager側に、その通知を受け取れるようにして下さい。
            // console.log (this.HP);
        }
    }

    /**
     * 機体描画
     * 三角形
     * @param {ctx} context
     */
    draw (context) {
		context.beginPath();
		context.moveTo(this.x - 20, this.y + 10);
		context.lineTo(this.x + 20, this.y);
		context.lineTo(this.x - 20, this.y - 10);
		context.closePath();

		context.strokeStyle = "rgb(0,0,0)"; //枠線の色
		context.stroke();

		context.fillStyle="rgba(0,0,255, 1)";//塗りつぶしの色
		context.fill();
    }
}
