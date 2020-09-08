import TemplateEngine from '../src/helper/template-engine';
import { safeEval } from '../src/helper/template-engine/safe-eval';
// import { isUndefined } from "../src/utils";
import * as utils from "../src/utils/checker";

const sourceData = {
  BornCityCN: "蚌埠市",
  BornCityEN: "",
  BornProvinceCN: "安徽省",
  BornProvinceEN: "",
  Borndate: "1990-05-01",
  Email: "m4kemav@gmail.com",
  ExpiryDate: "2020-09-08",
  GivenNameCN: "啊",
  GivenNameEN: "AA",
  HomeAddrCityCN: "安庆市",
  HomeAddrCityEN: "",
  HomeAddrDetail2CN: "",
  HomeAddrDetail2EN: "",
  HomeAddrDetailCN: "上海市",
  HomeAddrDetailEN: "",
  HomeAddrDistrictCEN: "",
  HomeAddrDistrictCN: "枞阳县",
  HomeAddrPostcode: "",
  HomeAddrProvinceCN: "安徽省",
  HomeAddrProvinceEN: "",
  HomeAddrProvinceID: "",
  HomePostcode: "721000",
  IssueAuthority: "",
  IssueDate: "2020-09-08",
  IssuePlace: "澳大利亚",
  IssuePlaceEN: "",
  NationalityCN: "中国大陆",
  NationalityEN: "CN",
  PassportNO: "23133",
  PassportType: "香港签证身份书",
  PassportURL: "",
  Phone: "18115164284",
  PhotoURL: "",
  Sex: "M",
  StayAddPostCode: "721000",
  StayAddrDetail2CN: "",
  StayAddrDetail2EN: "",
  StayAddrDetailCN: "上海市",
  StayAddrDetailEN: "",
  StayAddrPostcode: "",
  StayCityCN: "上海市",
  StayCityEN: "",
  SurnameCN: "啊啊",
  SurnameEN: "AK",
  TicketURL: "",
  UsedNationalityCN: "",
  UsedNationalityEN: "",
  VisaType: "",
  currentAddress: "安徽省安庆市枞阳县",
}
describe('template-engine', () => {
  it('should execute code', function() {
    const tpl = '{{a}}';
    const mockData = { a: 100 };
    const tplEngine = new TemplateEngine();
    const result = tplEngine.execute(tpl, mockData);
    expect(result).toEqual(100);
  });

  it('safe eval work', () => {
    const tpl = '1+1';
    const result = safeEval(tpl);
    expect(result).toEqual(2);
  });

  it("safe eval is safe", function() {
    const tpl = "1";
    const result = safeEval(tpl);
    expect(result).toBe(1);
    const tpl1 = "onchange";
    const result1 = safeEval(tpl1);
    expect(result1).toBe(undefined)
  });

  it("safe eval throw error", function() {
    const tpl = "asd///"
    expect(() => safeEval(tpl)).toThrow();
  });

  it("safe eval without window", () => {
    const spy = jest.spyOn(utils, 'isUndefined');
    spy.mockReturnValue(true);
    const tpl = "1";
    expect(() => safeEval(tpl)).toThrow();
    spy.mockRestore();
  })

  it('execute expression should work', function() {
    const tpl = '{{1 + 1}}';
    const tplEngine = new TemplateEngine();
    const result = tplEngine.execute(tpl, {});
    expect(result).toEqual(2);
  });

  it('execute expression with variable should work', function() {
    const tpl = '{{a + 1}}';
    const tplEngine = new TemplateEngine();
    const result = tplEngine.execute(tpl, { a: 100 });
    expect(result).toEqual(101);
  });

  it('execute expression with two variable should work', function() {
    const tpl = '{{a + b}}';
    const tplEngine = new TemplateEngine();
    const result = tplEngine.execute(tpl, { a: 100, b: 200 });
    expect(result).toEqual(300);
  });

  it('ternary operator should work', () => {
    const tpl = '{{a > 100 ? 1 : 2}}';
    const mockData = { a: 100 };
    const tplEngine = new TemplateEngine();
    let result = tplEngine.execute(tpl, mockData);
    expect(result).toEqual(2);
    mockData.a = 101;
    result = tplEngine.execute(tpl, mockData);
    expect(result).toEqual(1);
  });

  it('call function should work', () => {
    const tpl = '{{d}}';
    const mockData = { a: { b: { c: 12 } }, actions: {d: (current: any) => current.b.c} };
    const tplEngine = new TemplateEngine();
    let result = tplEngine.execute(tpl, mockData, { b: { c: 12 } });
    expect(result).toEqual(12);
  });

  it('call lang api should work', () => {
    const tpl = '{{[a]}}';
    const mockData = {
    a: 1
  };
    const tplEngine = new TemplateEngine();
    let result = tplEngine.execute(tpl, mockData, { b: { c: 12 } });
    expect(result).toEqual([1]);
  });
  it('compare should work', () => {
    const tpl = '{{a === "a"}}';
    const mockData = {
      a: 'a'
    };
    const tplEngine = new TemplateEngine();
    let result = tplEngine.execute(tpl, mockData, { b: { c: 12 } });
    expect(result).toEqual(true);
  });

  it('compare should work', () => {
    const tpl = '{{a.b === "a"}}';
    const mockData = {
      a: {
        b: "a"
      }
    };
    const tplEngine = new TemplateEngine();
    let result = tplEngine.execute(tpl, mockData);
    expect(result).toEqual(true);
  });
  it('prod test', () => {
    const tplEngine = new TemplateEngine();
    const defaultData = tplEngine.execute(
      "{{Borndate}}",
      sourceData,
    );
    const defaultData1 = tplEngine.execute(
      "{{IssuePlace}}",
      sourceData,
    );
    expect(defaultData).toEqual("1990-05-01")
    expect(defaultData1).toEqual("澳大利亚")
  })
});