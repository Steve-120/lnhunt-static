document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem("metametaEnabled") === "true"){

        replacefrom = "A new world. Familiar puzzles. A quest like no other. Journey on an exciting isekai adventure!";
        replaceto = '<time title="+6">A</time> ne<time title="+1">w</time> worl<time title="-6">d</time>. Fa<time title="-3">m</time>ilia<time title="-4">r</time> puzzles. A <time title="-1">q</time>uest <time title="-8">l</time>ike no ot<time title="+0">h</time>er. <time title="-2">J</time>ourne<time title="-6">y</time> on an e<time title="+4">x</time>citing <time title="+3">i</time>sekai ad<time title="+5">v</time>entur<time title="-6">e</time>!';
        document.body.innerHTML = document.body.innerHTML.replace(replacefrom, replaceto);

        replacefrom = 'This is a puzzlehunt run by a mysterious, otherworldly group of puzzlers. Be sure to check out our <a href="/about">about</a> page for more information.';
        replaceto = '<time title="-8">T</time>his is a <time title="+0">p</time>uz<time title="+8">z</time>lehunt r<time title="+2">u</time>n by a mysterious, <time title="-5">o</time>therworldly <time title="+2">g</time>roup of puzzlers. <time title="-1">B</time>e <time title="-3">s</time>ure to <time title="+2">c</time>hec<time title="-9">k</time> out our <a href="/about">about</a> page <time title="+3">f</time>or more informatio<time title="-5">n</time>.';
        document.body.innerHTML = document.body.innerHTML.replace(replacefrom, replaceto);
    }
});
