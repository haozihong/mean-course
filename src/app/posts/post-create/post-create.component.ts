import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';

  constructor(public postsService: PostsService) {}

  // convention to start methord for event with a 'on'
  // onAddPost(postInput: HTMLTextAreaElement) {
    // console.dir(postInput);
    // this.newPost = postInput.value;
  // }

  onAddPost(form: NgForm) {
    if (form.invalid) return;
    this.postsService.addPost(form.value.title, form.value.content);
  }
}
