/**
 * Copyright 2017 Tatsuya Egawa
 * Rreleased under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 **/

"use strict";

;(($) => {
    let tags = [];
    let settings = {
        speed: 0.5,
        inner_wall: 0,
        cont_x: 300,
        cont_y: 300
    };
    let opts = {};

    class Tag {
        constructor(entity, x, y, max_x, max_y, min_x, min_y, speed, dx, dy) {
            this.entity = entity;
            this.x = x;
            this.y = y;
            this.max_x = max_x;
            this.max_y = max_y;
            this.min_x = min_x;
            this.min_y = min_y;
            this.speed = speed;
            this.dx = Math.random() * speed - speed / 2;
            this.dy = Math.random() * speed - speed / 2;
        }

        set_pos() {
            this.entity.css("left", this.x);
            this.entity.css("top", this.y);
        }

        update_pos() {
            if (this.x > this.max_x) {
                this.dx = -this.speed * (Math.random() + this.speed);
            } else if (this.x < this.min_x) {
                this.dx = Math.random() * (this.speed / 2) + (this.speed / 2);
            }
            this.x += this.dx;

            if (this.y > this.max_y) {
                this.dy = -this.speed * (Math.random() + this.speed);
            } else if (this.y < this.min_y) {
                this.dy = Math.random() * (this.speed / 2) + (this.speed / 2);
            }
            this.y += this.dy;

            this.set_pos();
        }

        update_kabe() {
            this.max_x = opts.cont_x - this.entity.width() - opts.inner_wall;
            this.max_y = opts.cont_y - this.entity.height() - opts.inner_wall;
        }
    }

    const methods = {
        init: function(...args) {
            opts = $.extend(settings, args[0]);
            opts.cont_x = this.width();
            opts.cont_y = this.height();
            for (let i = 0; i < this.children().length; i++) {
                tags.push(
                    new Tag(
                        $(this.children()[i]),
                        opts.cont_x / 2,
                        opts.cont_y / 2,
                        opts.cont_x - $(this.children()[i]).width() - opts.inner_wall,
                        opts.cont_y - $(this.children()[i]).height() - opts.inner_wall,
                        opts.inner_wall,
                        opts.inner_wall,
                        opts.speed
                    )
                );
            }
            setInterval(() => {
                for (let i = 0; i < tags.length; i++) {
                    tags[i].update_pos();
                }
            }, 5);
        },
        add: function(...args) {
            tags.push(
                new Tag(
                    args[0],
                    opts.cont_x / 2,
                    opts.cont_y / 2,
                    opts.cont_x - $(args[0]).width() - opts.inner_wall,
                    opts.cont_y - $(args[0]).height() - opts.inner_wall,
                    opts.inner_wall,
                    opts.inner_wall,
                    opts.speed
                )
            );
        },
        kabe: function(...args) {
            const key = args[0];
            for (let i = 0; i < tags.length; i++) {
                if (key === tags[i].entity.attr("id")) {
                    tags[i].update_kabe();
                    break;
                }
            }
        }
    };
    $.fn.kabeatte = function(method, ...args) {
        if (methods[method]) {
            return methods[method].apply(this, args);
        } else {
            $.error("Method does not exist in kabeatte: " + method);
        }
    }
})(jQuery);
