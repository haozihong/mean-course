import { Component, EventEmitter, Output } from '@angular/core';

import { Post } from '../post.model'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();

  // convention to start methord for event with a 'on'
  // onAddPost(postInput: HTMLTextAreaElement) {
    // console.dir(postInput);
    // this.newPost = postInput.value;
  // }

  onAddPost() {
    const post: Post = {
      title: this.enteredTitle,
      content: this.enteredContent
    };
    this.postCreated.emit(post);
  }
}
