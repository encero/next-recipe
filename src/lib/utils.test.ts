/* eslint-disable @typescript-eslint/no-unsafe-argument */
describe("cn (class name utility using clsx + tailwind-merge)", () => {
  test("returns empty string when no inputs are provided", () => {
    // @ts-expect-error - testing runtime behavior with no args
    expect(cn()).toBe("");
  });

  test("concatenates simple string classes", () => {
    expect(cn("p-2", "m-4")).toBe("p-2 m-4");
    expect(cn("btn", "btn-primary")).toBe("btn btn-primary");
  });

  test("handles falsy values and conditionals like clsx", () => {
    expect(cn("p-2", null, undefined, false, 0 && "hidden", "", "block")).toBe("p-2 block");
    expect(cn({ "pt-2": true, "pt-4": false }, "px-2")).toBe("pt-2 px-2");
  });

  test("flattens nested arrays and merges correctly", () => {
    expect(cn(["p-2", ["m-1", ["rounded"]]], "block")).toBe("p-2 m-1 rounded block");
    expect(cn(["text-sm", ["text-base"]])).toBe("text-base");
  });

  test("Tailwind conflict resolution prefers the latter class (e.g., padding utilities)", () => {
    // tailwind-merge should keep the latter conflicting utility
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-left", "text-center")).toBe("text-center");
    expect(cn("font-light", "font-bold")).toBe("font-bold");
  });

  test("merges directional and axis-specific utilities correctly", () => {
    // For example, px- overrides individual pl-/pr- when later
    expect(cn("pl-2 pr-3", "px-4")).toBe("px-4");
    // Later specific side should override or complement correctly
    expect(cn("px-4", "pl-2")).toBe("pl-2 pr-4");
  });

  test("deduplicates identical classes, keeping one instance", () => {
    expect(cn("p-4", "p-4", "p-4")).toBe("p-4");
    expect(cn("inline", "inline")).toBe("inline");
  });

  test("mixes Tailwind and arbitrary/unknown classes without altering unknowns", () => {
    expect(cn("p-2", "custom-card", "p-4")).toBe("custom-card p-4");
    // order: clsx keeps order, twMerge merges conflicts; unknown classes should stay in order
    expect(cn("custom-a", "text-sm", "custom-b", "text-lg")).toBe("custom-a custom-b text-lg");
  });

  test("object and array combinations with conditionals are merged predictably", () => {
    const isActive = true;
    const isDisabled = false;
    expect(
      cn(
        "btn",
        ["text-sm", { "text-lg": true }],
        { "btn-active": isActive, "btn-disabled": isDisabled },
        null,
        ["p-2", ["p-4"]]
      )
    ).toBe("btn btn-active text-lg p-4");
  });

  test("arbitrary variants and modifiers are preserved, conflicts resolved by tailwind-merge", () => {
    // Ensure variant prefixes are handled properly
    expect(cn("hover:p-2", "hover:p-4")).toBe("hover:p-4");
    expect(cn("sm:text-sm", "sm:text-lg")).toBe("sm:text-lg");
    // Ensure mixing base and variant preserves both where not conflicting
    expect(cn("text-sm", "hover:text-lg")).toBe("text-sm hover:text-lg");
  });

  test("data-attribute selectors and arbitrary values pass through correctly", () => {
    // Arbitrary values should not be dropped; conflicts resolved
    expect(cn("[mask-type:luminance]", "[mask-type:alpha]")).toBe("[mask-type:alpha]");
    expect(cn("bg-[color:var(--brand)]", "bg-[color:red]")).toBe("bg-[color:red]");
    // data selectors survive
    expect(cn('data-[state=open]:opacity-100', 'data-[state=open]:opacity-50')).toBe('data-[state=open]:opacity-50');
  });

  test("whitespace and empty strings are safely ignored", () => {
    expect(cn("  ", "", "p-2", "   ", "m-1")).toBe("p-2 m-1");
  });
});