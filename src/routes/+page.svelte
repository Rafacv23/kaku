<script lang="ts">
	let { data } = $props();
</script>

<h1>Kaku</h1>
<p lang="ja">{data.health.message}</p>
<p>API {data.health.status} at <time datetime={data.health.time}>{data.health.time}</time></p>
