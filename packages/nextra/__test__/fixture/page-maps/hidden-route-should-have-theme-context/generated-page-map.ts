import _1_level_2_level_meta from "./1-level/2-level/_meta.ts";
export const pageMap = [{
  name: "1-level",
  route: "/1-level",
  children: [{
    name: "2-level",
    route: "/1-level/2-level",
    children: [{
      data: _1_level_2_level_meta
    }, {
      name: "foo",
      route: "/1-level/2-level/foo",
      frontMatter: {
        "sidebarTitle": "Foo"
      }
    }]
  }]
}];