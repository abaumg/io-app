import semver from "semver";
// Check min version app supported
export const isVersionAppSupported = (
  minAppVersion: string | undefined,
  deviceVersion: string
): boolean => {
  // If the backend-info is not available (es. request http error) continue to use app
  if (minAppVersion !== undefined) {
    const minVersion =
      semver.valid(minAppVersion) === null
        ? semver.coerce(minAppVersion)
        : minAppVersion;
    return minVersion !== null
      ? semver.satisfies(minVersion, `<=${deviceVersion}`)
      : true;
  } else {
    return true;
  }
};
