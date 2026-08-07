import { Reflector } from '@nestjs/core';

// 🔶 It's just used to add some additional metadata to a perticular route or controller and we can access them through the `Reflector` service.
// 🔸 To access the metadata from the `Reflector` service, we use "Roles" as the key and to access the metadata, we pass the request object "context.getHandler()" to the `get` method.
export const Roles = Reflector.createDecorator<string>();
