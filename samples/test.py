hashmap={}
connections=[[0,1],[0,2],[1,2],[1,3],[2,3]]
for index,i in enumerate(connections):
    if i[0] not in hashmap:
        hashmap[i[0]]={}
    hashmap[i[0]][i[1]]=1 
    if i[1] not in hashmap:
        hashmap[i[1]]={} 
    hashmap[i[1]][i[0]]=1 
    
print(hashmap)
s="-063de72d-dd6c-41d8-9cee-72ec0be1816d"
print(len(s))