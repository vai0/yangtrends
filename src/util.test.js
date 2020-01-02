const { isPollOfficial } = require("./util");

test("Accurately identifies official poll", () => {
    expect(isPollOfficial({ pollsterRatingId: "3", sponsorIds: null })).toBe(
        true
    );
    expect(
        isPollOfficial({ pollsterRatingId: "391", sponsorIds: ["133"] })
    ).toBe(true);
    expect(
        isPollOfficial({ pollsterRatingId: "357", sponsorIds: ["944"] })
    ).toBe(true);
    expect(
        isPollOfficial({ pollsterRatingId: "391", sponsorIds: null })
    ).not.toBe(true);
});
