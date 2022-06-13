import { YamlLoader } from "yaml_loader";

const yamlLoader = new YamlLoader();

export async function readYaml<T>(
  path: string,
): Promise<T> {
  let allPath = path;
  if (!/\.(yaml|yml)$/.test(path)) {
    allPath += ".yaml";
  }
  const data = await yamlLoader.parseFile(allPath);
  return data as T;
}
