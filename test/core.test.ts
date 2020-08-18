import Manage from "../src/core/manage";
// babel plugin parser re-export error.
import { SingleContext } from "../src/core/provider/context";

describe("core.manage", function() {
  const manage = new Manage({a: 1});
  it("object work", () => {
    manage.storeForm = { a: 2 };
    expect(manage.storeForm.a).toBe(1);
  })
  it("subscribe should work", function() {
    const mockSetState = jest.fn(data => data);
    manage.subscribe(mockSetState);
    manage.notify({a: 2})
    expect(mockSetState.mock.calls.length).toBe(1);
    expect(manage.data.a).toBe(2)
  });

  it("notifyByPath should work", function() {
    const mockSetState = jest.fn(data => data);
    manage.subscribe(mockSetState);
    manage.notifyByPath("a.b.c", {a: 2})
    expect(mockSetState.mock.calls.length).toBe(1);
    expect((manage.data.a as any).b.c).toEqual({a: 2})
  });

  it("protected store form data", function() {
    const mockSetState = jest.fn(data => data);
    manage.subscribe(mockSetState);
    manage.notify({a: 2})
    expect(manage.storeForm).toEqual({a: 1})
  });
});

describe("core.context", () => {
  it("context should work", function() {
    const context = SingleContext.getContext();
    expect(context.displayName).toBe("FormProvider");
  });

  it("same context", function() {
    const context = SingleContext.getContext();
    const context1 = SingleContext.getContext();
    expect(context === context1).toBe(true);
  });
})