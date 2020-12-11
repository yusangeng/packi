export default function commandArgumentHelper<T extends any[]>(argKeys: string[], rawArgs: string[]): T {
  const argMap: Record<string, any> = {};

  rawArgs.forEach(el => {
    const [key, value] = el
      .split("=")
      .filter(seg => !!seg)
      .map(seg => seg.trim());

    if (typeof key === "undefined") {
      // 作废的参数项
      return;
    }

    if (typeof value === "undefined") {
      // 没有值的参数，可以表示boolean类型
      argMap[key] = true;
      return;
    }

    if (value === "true" || value === "false") {
      // true或false表示boolean类型
      argMap[key] = value === "true";
      return;
    }

    try {
      const n = parseFloat(value);

      if (!isNaN(n)) {
        argMap[key] = n;
        return;
      }
    } catch (err) {
      // 忽略错误
    }

    argMap[key] = value;
  });

  return (argKeys.map(key => argMap[key]) as any) as T;
}
