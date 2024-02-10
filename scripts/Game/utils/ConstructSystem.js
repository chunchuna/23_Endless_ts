export class ConstructSystem {
    IsUpdate = false;
    Init(runtime) {
        console.log(ConstructSystem.name + "Init");
        new ConstructSystem().Event(runtime);
    }
    Update(runtime) {
        if (!this.IsUpdate) {
            console.log(ConstructSystem.name + "Update");
            this.IsUpdate = true;
        }
    }
    Event(runtime) {
        console.log(ConstructSystem.name + "Event");
    }
}
