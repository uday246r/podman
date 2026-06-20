import {
  __federation_method_setRemote as setRemote,
  __federation_method_getRemote as getRemote,
  __federation_method_unwrapDefault as unwrapModule
} from "virtual:__federation__";

export async function loadRemoteComponent(
  remoteName,
  remoteUrl,
  exposedModule
) {
  setRemote(remoteName, {
    url: remoteUrl,
    format: "esm",
    from: "vite"
  });

  const remoteModule =
    await getRemote(
      remoteName,
      exposedModule
    );

  return unwrapModule(remoteModule);
}