[![Build Status](https://travis-ci.com/itfobos/ts-optional.svg?branch=master)](https://travis-ci.com/itfobos/ts-optional)

# TS Optional
Typescript adapted Java [Optional class](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html).

The library barebone is generated with 
[typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter) (by @alexjover). 

### Usage examples
##### Optional instance can be created with:
- `Optional.ofNullable(someValue)`
- `Optional.of(nonNullableValue)`
- `Optional.empty()`

##### Can be used like:

```typescript
  const entityUuid = Optional.of(response)
      .filter(resp => resp.isPresent)
      .map(responseToEntity)
      .map(entity => entity.uuid)
      .filter(isNotNullOrEmpty)
      .orElseGet(() => route.snapshot.queryParamMap.get('uuid') as string);
```

### Supported Node versions
Automatically tested with Node versions:
- 8
- 10
- 11
- 12

### Travis CI
To integrate with the CI, github [personal access tokens](https://github.com/settings/tokens) 
should be generated. 
Generated value should be defined in Travis as _GH_TOKEN_ 
[environment variable](https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings) for _master_ branch.
