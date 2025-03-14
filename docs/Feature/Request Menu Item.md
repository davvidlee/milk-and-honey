```plantuml

actor User as u
participant MenuUI as m
participant ClientAPI as c
database FirestoreDB as d

u-> m: something
m -> c: getMenuItem()
c -> d: requestMenuItem()
d -> c: sendMenuItem()
c -> m: renderMenuItem()

```





