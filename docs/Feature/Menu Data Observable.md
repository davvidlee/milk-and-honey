```plantuml

participant MenuUI as m
participant MenuDataObservable as md
participant UseCollection as u
database FirestoreDB as d

md -> md: observableInit()
u -> d: listenEvent()
d -> u: data
u -> md: sendData()
md -> m: renderMenu()

```

 















