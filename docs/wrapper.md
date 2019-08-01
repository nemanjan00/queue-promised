# wrapper
<a name="wrapper"></a>

## wrapper(rateLimited, [countOrOptions]) ⇒ <code>function</code>
Wrapper for function, for rate limiting

**Kind**: global function  
**Returns**: <code>function</code> - rateLimited - Function you passed as param, now rate limited  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| rateLimited | <code>function</code> |  | Function you want to rate limit |
| [countOrOptions] | <code>number</code> \| <code>Object</code> | <code>1</code> | Count of worker instances or options object |
| countOrOptions.count | <code>number</code> |  | Count of worker instances |
| countOrOptions.maxTime | <code>number</code> |  | Maximum time in ms to execute function |
| countOrOptions.minTime | <code>number</code> |  | Minimum time to pass before response is resolved |

