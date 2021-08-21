let TextButton = new Phaser.Class({

    params: {
        activeColor: 0x7cfc00,
        disabledColor: 0x778899,
        width: 200,
        height: 130,
    },

    initialize:
    function TextButton(scene, x, y, text, callback, active = true) {
        this.active = active;
        this.callback = callback;
        let width = this.params.width;
        let height = this.params.height;

        this.base = scene.add.rectangle(x, y, width, height, this.getColor());
        this.outline = scene.add.rectangle(x, y, width * 1.1 + 6, height * 1.1 + 6, 0xffffff);
        this.outline.setDepth(-5);
        this.outline.setVisible(false);

        this.buttonText = scene.add.text(x, y, text, { font: "32px Arial", fill: "#000000", wordWrap: { width: width }, align: 'center' });
        this.buttonText.setOrigin(0.5, 0.5);

        this.base.setInteractive().on('pointerup', function (event) {
            if (this.active) this.callback();
        }, this);

        this.base.on('pointerover', () => {
            if (this.active) {
                this.base.setScale(1.1);
                this.outline.setVisible(true);
            }
        });
        this.base.on('pointerout', () => {
            this.base.setScale(1);
            this.outline.setVisible(false);
        })
    },

    getColor: function () {
        if (this.active) return this.params.activeColor;
        else return this.params.disabledColor;
    },

    setActive: function (active) {
        this.active = active;
    },

    setDepth: function (depth) {
        this.base.depth = depth;
        this.outline.depth = depth - 5;
    },

    setVisible: function (visible) {
        this.base.setVisible(visible);
        this.nameText.setVisible(visible);
    }
});