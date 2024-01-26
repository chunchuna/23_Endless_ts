export class WallInstance {
    static Update(runtime) {
        for (let Walls_1 of runtime.objects.wall.instances()) {
            for (let Walls_2 of runtime.objects.wall.instances()) {
                if (Walls_1.getChildAt(0)?.testOverlap(Walls_2)) {
                    if (Walls_2 != Walls_1) {
                        //Walls_1.setAnimation("Line")
                        Walls_2.setAnimation("Line");
                    }
                    else {
                        Walls_1.setAnimation("Normal");
                        Walls_2.setAnimation("Normal");
                    }
                }
            }
        }
    }
    static Init(runtime) {
    }
}
