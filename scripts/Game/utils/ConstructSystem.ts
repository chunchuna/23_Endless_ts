export class ConstructSystem {
    private IsUpdate: boolean = false;

    public Init(runtime: IRuntime) {
        console.log(ConstructSystem.name + "Init")
        new ConstructSystem().Event(runtime);

    }

    public Update(runtime: IRuntime) {
        if (!this.IsUpdate) {
            console.log(ConstructSystem.name + "Update")
            this.IsUpdate = true;
        }
        

    }

    public Event(runtime: IRuntime) {
        console.log(ConstructSystem.name + "Event")
    }

}