<script lang="ts">
	import "../../lib";
</script>

<main>
	<h1>Виджеты</h1>
	<p>Демо-страница библиотеки. Чат-бот в правом нижнем углу, рекламные виджеты ниже.</p>

	<section class="ads">
		<div class="ad-cell">
			<h2>Светлая · v1</h2>
			<ad-widget theme="light" variant="v1"></ad-widget>
		</div>
		<div class="ad-cell">
			<h2>Светлая · v2</h2>
			<ad-widget theme="light" variant="v2"></ad-widget>
		</div>
		<div class="ad-cell dark-bg">
			<h2>Тёмная · v1</h2>
			<ad-widget theme="dark" variant="v1"></ad-widget>
		</div>
		<div class="ad-cell dark-bg">
			<h2>Тёмная · v2</h2>
			<ad-widget theme="dark" variant="v2"></ad-widget>
		</div>
	</section>

	<p class="hint">Сузьте окно до &lt; 600px, чтобы увидеть мобильную (квадратную) раскладку.</p>

	<chat-widget username="Богдан Корж"></chat-widget>
</main>

<style>
	main {
		padding: 2em 1em 6em;
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}
	h1 {
		color: #f5a623;
		font-weight: 700;
	}
	.ads {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		justify-content: center;
		margin-top: 2em;
	}
	.ad-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 16px;
		border-radius: 14px;
	}
	.ad-cell h2 {
		font-size: 13px;
		font-weight: 600;
		color: #888;
		margin: 0;
	}
	.dark-bg {
		background: #161618;
	}
	.dark-bg h2 {
		color: #aaa;
	}
	.hint {
		margin-top: 2em;
		color: #999;
		font-size: 13px;
	}
</style>
